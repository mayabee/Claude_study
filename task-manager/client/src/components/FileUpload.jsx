import { useState, useRef } from 'react'
import { FiUploadCloud, FiLink, FiFile, FiImage } from 'react-icons/fi'
import { FaGoogleDrive } from 'react-icons/fa'

function FileUpload({ taskId, attachments, onUpload, onAddDriveLink }) {
  const [dragOver, setDragOver] = useState(false)
  const [showDriveForm, setShowDriveForm] = useState(false)
  const [driveName, setDriveName] = useState('')
  const [driveUrl, setDriveUrl] = useState('')
  const fileInputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    files.forEach(file => onUpload(taskId, file))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => onUpload(taskId, file))
  }

  const handleDriveSubmit = () => {
    if (!driveName || !driveUrl) return alert('이름과 URL을 입력하세요')
    onAddDriveLink(taskId, driveName, driveUrl)
    setDriveName('')
    setDriveUrl('')
    setShowDriveForm(false)
  }

  const isImage = (mimetype) => mimetype?.startsWith('image/')

  return (
    <div className="file-upload">
      <strong>첨부파일</strong>

      {/* 기존 첨부파일 목록 */}
      {attachments.length > 0 && (
        <div className="attachment-list">
          {attachments.map((att, i) => (
            <a key={i} href={att.url} target="_blank" rel="noopener noreferrer" className="attachment-item">
              {att.type === 'google_drive' ? (
                <FaGoogleDrive className="att-icon drive" />
              ) : isImage(att.mimetype) ? (
                <FiImage className="att-icon image" />
              ) : (
                <FiFile className="att-icon file" />
              )}
              <span>{att.name}</span>
              {att.type === 'google_drive' && <span className="badge">Drive</span>}
            </a>
          ))}
        </div>
      )}

      {/* 업로드 영역 */}
      <div
        className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <FiUploadCloud size={24} />
        <p>파일을 드래그하거나 클릭하여 업로드</p>
        <span className="drop-hint">☁️ Cloud Storage에 저장됩니다</span>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {/* Google Drive 링크 */}
      <button className="btn-drive" onClick={() => setShowDriveForm(!showDriveForm)}>
        <FaGoogleDrive /> Google Drive 링크 추가
      </button>

      {showDriveForm && (
        <div className="drive-form">
          <input
            type="text"
            placeholder="파일 이름"
            value={driveName}
            onChange={(e) => setDriveName(e.target.value)}
          />
          <input
            type="url"
            placeholder="Google Drive URL"
            value={driveUrl}
            onChange={(e) => setDriveUrl(e.target.value)}
          />
          <button onClick={handleDriveSubmit} className="btn-primary btn-sm">추가</button>
        </div>
      )}
    </div>
  )
}

export default FileUpload
