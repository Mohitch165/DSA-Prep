import { useEffect, useState, useRef, useMemo } from 'react';
import { Upload, FileText, X, Image as ImageIcon, Info, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { PROBLEMS } from '@/data/problems';
import { useAttachments } from '@/hooks/useAttachments';
import type { Attachment } from '@/lib/attachments';
import { cn } from '@/lib/utils';
import type { ProgressMap } from '@/types';

interface Props {
  problemId: number | null;
  onClose: () => void;
  progress: ProgressMap;
  setNotes: (id: number, text: string) => void;
  onAttachmentsChange?: () => void;
}

export function NotesModal({ problemId, onClose, progress, setNotes, onAttachmentsChange }: Props) {
  const [text, setText] = useState('');
  const [previewAtt, setPreviewAtt] = useState<Attachment | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const problem = useMemo(() => problemId !== null ? PROBLEMS.find(p => p.id === problemId) : null, [problemId]);

  const { attachments, loading, error, upload, remove } = useAttachments(problemId, onAttachmentsChange);

  useEffect(() => {
    if (problemId !== null) setText(progress[problemId]?.notes || '');
  }, [problemId, progress]);

  useEffect(() => {
    if (previewAtt) {
      const url = URL.createObjectURL(previewAtt.blob);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [previewAtt]);

  const save = () => {
    if (problemId !== null) setNotes(problemId, text);
    onClose();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    upload(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const formatSize = (blob: Blob) => {
    const kb = blob.size / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const isImage = (att: Attachment) => att.mimeType.startsWith('image/');
  const isPdf = (att: Attachment) => att.mimeType === 'application/pdf' || att.name.toLowerCase().endsWith('.pdf');

  return (
    <>
      <Dialog open={problemId !== null} onOpenChange={open => !open && onClose()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{problem?.title || 'Notes'}</DialogTitle>
            <DialogDescription>{problem ? `${problem.pattern} · ${problem.difficulty}` : ''}</DialogDescription>
          </DialogHeader>

          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Text notes</div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={5}
              placeholder="Your approach, key insights, time complexity, edge cases…"
              className="w-full bg-secondary/40 border border-input rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>

          <div className="border-t border-border/40 pt-4">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Handwritten / file attachments
                {attachments.length > 0 && <span className="text-foreground/60 normal-case font-normal">({attachments.length})</span>}
              </div>
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <Info className="w-3 h-3" />
                How to attach iPad notes?
                <ChevronDown className={cn('w-3 h-3 transition-transform', showHelp && 'rotate-180')} />
              </button>
            </div>

            {showHelp && (
              <div className="bg-secondary/30 border border-border/40 rounded-lg p-4 mb-3 text-sm space-y-3 animate-fade-in">
                <p className="text-muted-foreground text-xs">
                  GoodNotes has no public API/MCP, but here are 3 workflows that work today:
                </p>
                <div>
                  <div className="font-semibold text-foreground mb-1">⚡ AirDrop (fastest, recommended)</div>
                  <ol className="text-xs text-muted-foreground space-y-0.5 ml-4 list-decimal">
                    <li>In GoodNotes, tap the share icon on the page you wrote</li>
                    <li>Choose Export → Image (PNG) or PDF</li>
                    <li>AirDrop to this Mac</li>
                    <li>Drag the file into the drop zone below ↓</li>
                  </ol>
                </div>
                <div>
                  <div className="font-semibold text-foreground mb-1">☁️ iCloud Drive sync</div>
                  <ol className="text-xs text-muted-foreground space-y-0.5 ml-4 list-decimal">
                    <li>Make a folder in iCloud Drive: <code className="bg-secondary px-1 rounded">DSA-Notes/</code></li>
                    <li>From GoodNotes Export, save the page there</li>
                    <li>On Mac, open the folder and drag here</li>
                  </ol>
                </div>
                <div>
                  <div className="font-semibold text-foreground mb-1">⚙️ Apple Shortcut (one-time setup)</div>
                  <p className="text-xs text-muted-foreground ml-4">
                    Build an iPad Shortcut: "Get GoodNotes page → Save to iCloud DSA-Notes folder, named after the current problem". One tap to export afterward.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded p-2 mb-2">{error}</div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,application/pdf"
              onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
              className="hidden"
            />

            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer mb-3',
                dragOver ? 'border-primary bg-primary/10 scale-[1.01]' : 'border-border hover:border-primary/40 hover:bg-secondary/20'
              )}
            >
              <div className="flex flex-col items-center text-center">
                <Upload className={cn('w-6 h-6 mb-2 transition-colors', dragOver ? 'text-primary' : 'text-muted-foreground')} />
                <div className="text-sm font-medium">
                  {dragOver ? 'Drop to upload' : 'Drop GoodNotes export here'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  or click to browse · images & PDFs · stays local in your browser
                </div>
              </div>
            </div>

            {loading && <div className="text-xs text-muted-foreground text-center py-2">Loading…</div>}

            {attachments.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {attachments.map(att => (
                  <Thumbnail
                    key={att.id}
                    att={att}
                    isImage={isImage(att)}
                    isPdf={isPdf(att)}
                    formatSize={formatSize}
                    onPreview={() => setPreviewAtt(att)}
                    onDelete={() => { if (confirm(`Delete "${att.name}"?`)) remove(att.id); }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border/40">
            <Button variant="ghost" onClick={onClose}>Close</Button>
            <Button onClick={save}>Save text notes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {previewAtt && previewUrl && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewAtt(null)}>
          <button
            className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 rounded-full transition-colors z-10"
            onClick={() => setPreviewAtt(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="absolute top-4 left-4 text-white/80 text-sm">{previewAtt.name}</div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <a href={previewUrl} download={previewAtt.name} onClick={e => e.stopPropagation()}
              className="text-white/80 hover:text-white text-xs bg-white/10 hover:bg-white/20 backdrop-blur px-3 py-1.5 rounded-full transition-colors">
              Download
            </a>
            <a href={previewUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
              className="text-white/80 hover:text-white text-xs bg-white/10 hover:bg-white/20 backdrop-blur px-3 py-1.5 rounded-full transition-colors">
              Open in new tab
            </a>
          </div>
          <div className="max-w-6xl max-h-[85vh] w-full" onClick={e => e.stopPropagation()}>
            {isPdf(previewAtt) ? (
              <iframe src={previewUrl} className="w-full h-[85vh] bg-white rounded-lg shadow-2xl" title={previewAtt.name} />
            ) : (
              <img src={previewUrl} alt={previewAtt.name} className="max-w-full max-h-[85vh] object-contain mx-auto rounded-lg shadow-2xl" />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Thumbnail({
  att, isImage, isPdf, formatSize, onPreview, onDelete,
}: {
  att: Attachment; isImage: boolean; isPdf: boolean;
  formatSize: (b: Blob) => string;
  onPreview: () => void; onDelete: () => void;
}) {
  const [thumb, setThumb] = useState<string | null>(null);

  useEffect(() => {
    if (isImage) {
      const url = URL.createObjectURL(att.blob);
      setThumb(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [att, isImage]);

  return (
    <div className="relative group bg-secondary/30 border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-all">
      <button onClick={onPreview} className="block w-full text-left">
        {isImage && thumb ? (
          <div className="aspect-[4/3] bg-white">
            <img src={thumb} alt={att.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-[4/3] bg-secondary/60 flex flex-col items-center justify-center text-muted-foreground">
            <FileText className="w-8 h-8" />
            <span className="text-xs mt-1 font-semibold">{isPdf ? 'PDF' : att.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}</span>
          </div>
        )}
        <div className="p-2">
          <div className="text-xs truncate font-medium">{att.name}</div>
          <div className="text-xs text-muted-foreground">{formatSize(att.blob)}</div>
        </div>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"
        title="Delete"
      >
        <X className="w-3 h-3 text-white" />
      </button>
    </div>
  );
}
