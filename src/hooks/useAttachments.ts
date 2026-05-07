import { useCallback, useEffect, useState } from 'react';
import { addAttachment, deleteAttachment, getAttachments, type Attachment } from '@/lib/attachments';

export function useAttachments(problemId: number | null, onChange?: () => void) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (problemId === null) { setAttachments([]); return; }
    setLoading(true);
    setError(null);
    try {
      const list = await getAttachments(problemId);
      setAttachments(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load attachments');
    } finally {
      setLoading(false);
    }
  }, [problemId]);

  useEffect(() => { refresh(); }, [refresh]);

  const upload = useCallback(async (files: FileList | File[]) => {
    if (problemId === null) return;
    const arr = Array.from(files);
    setError(null);
    try {
      for (const f of arr) {
        await addAttachment({
          problemId,
          name: f.name,
          mimeType: f.type || 'application/octet-stream',
          blob: f,
        });
      }
      await refresh();
      onChange?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    }
  }, [problemId, refresh, onChange]);

  const remove = useCallback(async (id: string) => {
    setError(null);
    try {
      await deleteAttachment(id);
      await refresh();
      onChange?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  }, [refresh, onChange]);

  return { attachments, loading, error, upload, remove, refresh };
}
