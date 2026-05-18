const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// 서버를 먼저 시작
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors());
app.use(express.json());

// Firestore (lazy)
let db, tasksCollection, storage;
function getDb() {
  if (!db) {
    const { Firestore } = require('@google-cloud/firestore');
    db = new Firestore();
    tasksCollection = db.collection('tasks');
  }
  return { db, tasksCollection };
}

function getStorage() {
  if (!storage) {
    const { Storage } = require('@google-cloud/storage');
    storage = new Storage();
  }
  return storage;
}

const bucketName = process.env.GCS_BUCKET || 'task-manager-files';

// Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// 정적 파일 서빙
const distPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// 헬스체크
app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

// 할일 목록 조회
app.get('/api/tasks', async (req, res) => {
  try {
    const { tasksCollection } = getDb();
    const { status, priority, category, search, showArchived } = req.query;
    const snapshot = await tasksCollection.orderBy('order', 'asc').get();
    let tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (showArchived !== 'true') tasks = tasks.filter(t => t.status !== 'completed');
    if (status && status !== 'all') tasks = tasks.filter(t => t.status === status);
    if (priority && priority !== 'all') tasks = tasks.filter(t => t.priority === priority);
    if (category && category !== 'all') tasks = tasks.filter(t => t.category === category);
    if (search) {
      const keyword = search.toLowerCase();
      tasks = tasks.filter(t =>
        t.title?.toLowerCase().includes(keyword) ||
        t.description?.toLowerCase().includes(keyword)
      );
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 할일 생성
app.post('/api/tasks', async (req, res) => {
  try {
    const { Firestore } = require('@google-cloud/firestore');
    const { tasksCollection } = getDb();
    const { title, description, priority, category, dueDate } = req.body;
    const countSnapshot = await tasksCollection.count().get();
    const order = countSnapshot.data().count;

    const task = {
      title,
      description: description || '',
      status: 'not_started',
      priority: priority || 'medium',
      category: category || '기타',
      dueDate: dueDate || null,
      order,
      attachments: [],
      createdAt: Firestore.Timestamp.now(),
      updatedAt: Firestore.Timestamp.now(),
    };

    const docRef = await tasksCollection.add(task);
    res.status(201).json({ id: docRef.id, ...task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 할일 수정
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { Firestore } = require('@google-cloud/firestore');
    const { tasksCollection } = getDb();
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: Firestore.Timestamp.now() };
    await tasksCollection.doc(id).update(updates);
    const doc = await tasksCollection.doc(id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 할일 삭제
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { tasksCollection } = getDb();
    await tasksCollection.doc(req.params.id).delete();
    res.json({ message: 'deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 순서 변경 (reorder를 :id보다 먼저 정의해야 함)
app.put('/api/reorder', async (req, res) => {
  try {
    const { db, tasksCollection } = getDb();
    const { orderedIds } = req.body;
    const batch = db.batch();
    orderedIds.forEach((id, index) => {
      batch.update(tasksCollection.doc(id), { order: index });
    });
    await batch.commit();
    res.json({ message: 'reordered' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cloud Storage 파일 업로드
app.post('/api/tasks/:id/upload', upload.single('file'), async (req, res) => {
  try {
    const { tasksCollection } = getDb();
    const s = getStorage();
    const { id } = req.params;
    const file = req.file;
    const fileName = `${id}/${Date.now()}-${file.originalname}`;
    const bucket = s.bucket(bucketName);
    const blob = bucket.file(fileName);

    await blob.save(file.buffer, { metadata: { contentType: file.mimetype } });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    const attachment = {
      name: file.originalname,
      url: publicUrl,
      type: 'cloud_storage',
      mimetype: file.mimetype,
      uploadedAt: new Date().toISOString(),
    };

    const doc = await tasksCollection.doc(id).get();
    const attachments = doc.data().attachments || [];
    attachments.push(attachment);
    await tasksCollection.doc(id).update({ attachments });

    res.json(attachment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Google Drive 링크 저장
app.post('/api/tasks/:id/drive-link', async (req, res) => {
  try {
    const { tasksCollection } = getDb();
    const { id } = req.params;
    const { name, url } = req.body;
    const attachment = {
      name, url,
      type: 'google_drive',
      uploadedAt: new Date().toISOString(),
    };

    const doc = await tasksCollection.doc(id).get();
    const attachments = doc.data().attachments || [];
    attachments.push(attachment);
    await tasksCollection.doc(id).update({ attachments });

    res.json(attachment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 카테고리 목록
app.get('/api/categories', async (_req, res) => {
  try {
    const { tasksCollection } = getDb();
    const snapshot = await tasksCollection.get();
    const categories = [...new Set(snapshot.docs.map(doc => doc.data().category).filter(Boolean))];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SPA 라우팅
app.get('{*path}', (_req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({ message: 'Task Manager API running' });
  }
});
