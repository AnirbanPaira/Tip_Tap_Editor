"use client";
import * as React from "react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Icons ---
import { VideoIcon } from "lucide-react" // Assuming lucide-react has a VideoIcon

import { Button } from "@/components/tiptap-ui-primitive/button"

export function isVideoActive(editor, extensionName) {
  if (!editor) return false
  return editor.isActive(extensionName);
}

export function insertVideo(editor, extensionName) {
  if (!editor) return false

  return editor
    .chain()
    .focus()
    .insertContent({
      type: extensionName,
    })
    .run();
}

export function useVideoUploadButton(
  editor,
  extensionName = "videoUpload",
  disabled = false
) {
  const isActive = isVideoActive(editor, extensionName)
  const handleInsertVideo = React.useCallback(() => {
    if (disabled) return false
    return insertVideo(editor, extensionName);
  }, [editor, extensionName, disabled])

  return {
    isActive,
    handleInsertVideo,
  }
}

export const VideoUploadButton = React.forwardRef((
  {
    editor: providedEditor,
    extensionName = "videoUpload",
    text,
    className = "",
    disabled,
    onClick,
    children,
    ...buttonProps
  },
  ref
) => {
  const editor = useTiptapEditor(providedEditor)
  const { isActive, handleInsertVideo } = useVideoUploadButton(editor, extensionName, disabled)

  const handleClick = React.useCallback((e) => {
    onClick?.(e)

    if (!e.defaultPrevented && !disabled) {
      handleInsertVideo()
    }
  }, [onClick, disabled, handleInsertVideo])

  if (!editor || !editor.isEditable) {
    return null
  }

  return (
    <Button
      ref={ref}
      type="button"
      className={className.trim()}
      data-style="ghost"
      data-active-state={isActive ? "on" : "off"}
      role="button"
      tabIndex={-1}
      aria-label="Add video"
      aria-pressed={isActive}
      tooltip="Add video"
      onClick={handleClick}
      {...buttonProps}>
      {children || (
        <>
          <VideoIcon className="tiptap-button-icon" />
          {text && <span className="tiptap-button-text">{text}</span>}
        </>
      )}
    </Button>
  );
})

VideoUploadButton.displayName = "VideoUploadButton"

export default VideoUploadButton
