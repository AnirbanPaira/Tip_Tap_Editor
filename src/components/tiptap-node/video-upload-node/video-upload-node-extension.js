import { mergeAttributes, Node } from "@tiptap/react"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { VideoUploadNode as VideoUploadNodeComponent } from "@/components/tiptap-node/video-upload-node/video-upload-node"

/**
 * A TipTap node extension that creates a video upload component.
 */
export const VideoUploadNode = Node.create({
  name: "videoUpload",

  group: "block",

  draggable: true,

  selectable: true,

  atom: true,

  addOptions() {
    return {
      accept: "video/*",
      limit: 1,
      maxSize: 0,
      upload: undefined,
      onError: undefined,
      onSuccess: undefined,
    }
  },

  addAttributes() {
    return {
      accept: {
        default: this.options.accept,
      },
      limit: {
        default: this.options.limit,
      },
      maxSize: {
        default: this.options.maxSize,
      },
      upload: {
        default: this.options.upload,
      },
      onError: {
        default: this.options.onError,
      },
      onSuccess: {
        default: this.options.onSuccess,
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="video-upload"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-type": "video-upload" }, HTMLAttributes),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoUploadNodeComponent);
  },

  addCommands() {
    return {
      setVideoUploadNode:
        (options = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  /**
   * Adds Enter key handler to trigger the upload component when it's selected.
   */
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { selection } = editor.state
        const { nodeAfter } = selection.$from

        if (
          nodeAfter &&
          nodeAfter.type.name === "videoUpload" &&
          editor.isActive("videoUpload")
        ) {
          const nodeEl = editor.view.nodeDOM(selection.$from.pos)
          if (nodeEl && nodeEl instanceof HTMLElement) {
            // Since NodeViewWrapper is wrapped with a div, we need to click the first child
            const firstChild = nodeEl.firstChild
            if (firstChild && firstChild instanceof HTMLElement) {
              firstChild.click()
              return true
            }
          }
        }
        return false
      },
    };
  },
})

export default VideoUploadNode
