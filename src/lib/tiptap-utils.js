export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

/**
 * Checks if a mark exists in the editor schema
 * @param markName - The name of the mark to check
 * @param editor - The editor instance
 * @returns boolean indicating if the mark exists in the schema
 */
export const isMarkInSchema = (markName, editor) => {
  if (!editor?.schema) return false
  return editor.schema.spec.marks.get(markName) !== undefined;
}

/**
 * Checks if a node exists in the editor schema
 * @param nodeName - The name of the node to check
 * @param editor - The editor instance
 * @returns boolean indicating if the node exists in the schema
 */
export const isNodeInSchema = (nodeName, editor) => {
  if (!editor?.schema) return false
  return editor.schema.spec.nodes.get(nodeName) !== undefined;
}

/**
 * Gets the active attributes of a specific mark in the current editor selection.
 *
 * @param editor - The Tiptap editor instance.
 * @param markName - The name of the mark to look for (e.g., "highlight", "link").
 * @returns The attributes of the active mark, or `null` if the mark is not active.
 */
export function getActiveMarkAttrs(editor, markName) {
  if (!editor) return null
  const { state } = editor
  const marks = state.storedMarks || state.selection.$from.marks()
  const mark = marks.find((mark) => mark.type.name === markName)

  return mark?.attrs ?? null
}

/**
 * Checks if a node is empty
 */
export function isEmptyNode(node) {
  return !!node && node.content.size === 0
}

/**
 * Utility function to conditionally join class names into a single string.
 * Filters out falsey values like false, undefined, null, and empty strings.
 *
 * @param classes - List of class name strings or falsey values.
 * @returns A single space-separated string of valid class names.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Finds the position and instance of a node in the document
 * @param props Object containing editor, node (optional), and nodePos (optional)
 * @param props.editor The TipTap editor instance
 * @param props.node The node to find (optional if nodePos is provided)
 * @param props.nodePos The position of the node to find (optional if node is provided)
 * @returns An object with the position and node, or null if not found
 */
export function findNodePosition(props) {
  const { editor, node, nodePos } = props

  if (!editor || !editor.state?.doc) return null

  // Zero is valid position
  const hasValidNode = node !== undefined && node !== null
  const hasValidPos = nodePos !== undefined && nodePos !== null

  if (!hasValidNode && !hasValidPos) {
    return null
  }

  if (hasValidPos) {
    try {
      const nodeAtPos = editor.state.doc.nodeAt(nodePos)
      if (nodeAtPos) {
        return { pos: nodePos, node: nodeAtPos };
      }
    } catch (error) {
      console.error("Error checking node at position:", error)
      return null
    }
  }

  // Otherwise search for the node in the document
  let foundPos = -1
  let foundNode = null

  editor.state.doc.descendants((currentNode, pos) => {
    // TODO: Needed?
    // if (currentNode.type && currentNode.type.name === node!.type.name) {
    if (currentNode === node) {
      foundPos = pos
      foundNode = currentNode
      return false
    }
    return true
  })

  return foundPos !== -1 && foundNode !== null
    ? { pos: foundPos, node: foundNode }
    : null
}

/**
 * Handles image upload with progress tracking and abort capability
 * @param file The file to upload
 * @param onProgress Optional callback for tracking upload progress
 * @param abortSignal Optional AbortSignal for cancelling the upload
 * @returns Promise resolving to the URL of the uploaded image
 */
export const handleImageUpload = async (file, onProgress, abortSignal) => {
  // Validate file
  if (!file) {
    throw new Error("No file provided")
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum allowed (${MAX_FILE_SIZE / (1024 * 1024)}MB)`)
  }

  // For demo/testing: Simulate upload progress
  for (let progress = 0; progress <= 100; progress += 10) {
    if (abortSignal?.aborted) {
      throw new Error("Upload cancelled")
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
    onProgress?.({ progress })
  }

  // Get pre-signed URL from the API route
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get pre-signed URL: ${error.error}`);
  }

  const { url: signedUrl } = await response.json();

  // Upload the file to S3 using the pre-signed URL
  const uploadResponse = await fetch(signedUrl, {
    method: "PUT",
    body: file,
    signal: abortSignal,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload file to S3: ${uploadResponse.statusText}`);
  }

  // Construct the public URL of the uploaded file
  // Assuming the S3 bucket is configured for public read access
  const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME; // Use NEXT_PUBLIC for client-side access
  const region = process.env.NEXT_PUBLIC_S3_REGION; // Use NEXT_PUBLIC for client-side access
  const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${file.name}`;

  return fileUrl;
}

/**
 * Converts a File to base64 string (Not used for S3 upload)
 * @param file The file to convert
 * @param abortSignal Optional AbortSignal for cancelling the conversion
 * @returns Promise resolving to the base64 representation of the file
 */
export const convertFileToBase64 = (file, abortSignal) => {
  if (!file) {
    return Promise.reject(new Error("No file provided"));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    const abortHandler = () => {
      reader.abort()
      reject(new Error("Upload cancelled"))
    }

    if (abortSignal) {
      abortSignal.addEventListener("abort", abortHandler)
    }

    reader.onloadend = () => {
      if (abortSignal) {
        abortSignal.removeEventListener("abort", abortHandler)
      }

      if (typeof reader.result === "string") {
        resolve(reader.result)
      } else {
        reject(new Error("Failed to convert File to base64"))
      }
    }

    reader.onerror = (error) =>
      reject(new Error(`File reading error: ${error}`))
    reader.readAsDataURL(file)
  });
}
