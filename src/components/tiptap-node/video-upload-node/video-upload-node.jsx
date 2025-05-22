import React, { useCallback, useEffect, useRef, useState } from "react"
import { NodeViewWrapper } from "@tiptap/react"
import { Button } from "@/components/tiptap-ui-primitive/button"
import { handleVideoUpload } from "@/lib/tiptap-utils" // Import the S3 upload utility

export const VideoUploadNode = ({ editor, node, getPos }) => {
  const { accept, limit, maxSize } = node.attrs
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [videoSrc, setVideoSrc] = useState(null)
  const [progress, setProgress] = useState(0) // State for upload progress
  const inputRef = useRef(null)
  const abortControllerRef = useRef(null) // Ref for AbortController

  const handleFileChange = useCallback(async (event) => {
    console.log("File change event:", event);
    console.log("event.target.files:", event.target.files);
    const file = event.target.files?.[0]
    console.log("Selected file:", file);

    if (!file) {
      console.error("No file selected in handleFileChange");
      return;
    }

    if (maxSize > 0 && file.size > maxSize) {
      setError(`File size exceeds the maximum limit of ${maxSize / (1024 * 1024)}MB.`)
      return
    }

    setUploading(true)
    setError(null)
    setProgress(0) // Reset progress

    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    try {
      const videoUrl = await handleVideoUpload(
        file,
        ({ progress }) => setProgress(progress), // Update progress state
        signal
      )

      setVideoSrc(videoUrl)
      setUploading(false)

      // Replace the upload node with a video node once uploaded
      editor.chain().focus().deleteRange({ from: getPos(), to: getPos() + node.nodeSize }).insertContent({
        type: 'video', // Assuming you have a 'video' node type
        attrs: { src: videoUrl },
      }).run();

    } catch (uploadError) {
      setError(`Upload failed: ${uploadError.message}`)
      setUploading(false)
      setProgress(0) // Reset progress on error
    } finally {
      abortControllerRef.current = null // Clear the abort controller
    }

  }, [editor, getPos, node.nodeSize, maxSize]);

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleCancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setError("Upload cancelled")
      setUploading(false)
      setProgress(0)
    }
  }, [])

  useEffect(() => {
    // Clear input value after file selection to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }, [uploading])

  return (
    <NodeViewWrapper className="video-upload-node">
      <div className="video-upload-container">
        {uploading ? (
          <>
            <p>Uploading video: {progress}%</p>
            <button onClick={handleCancelUpload}>Cancel</button>
          </>
        ) : error ? (
          <p className="error">{error}</p>
        ) : videoSrc ? (
           <video controls src={videoSrc} className="uploaded-video"></video>
        ) : (
          <Button onClick={handleClick}>
            Upload Video
          </Button>
        )}
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept={accept}
          multiple={limit > 1}
          style={{ display: "none" }}
        />
      </div>
    </NodeViewWrapper>
  )
}
