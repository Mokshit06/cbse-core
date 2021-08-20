import { useCallback, useEffect, useState } from 'react';
import type Quill from 'quill';
import 'quill/dist/quill.snow.css';
import socket from '@/lib/socket';
import { useRef } from 'react';

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'blockquote', 'code-block'],
  ['clean'],
];

export default function Editor({
  note,
}: {
  note: { userId: string; meetingId: string };
}) {
  const [quill, setQuill] = useState<Quill>();
  const effectRan = useRef(false);
  const wrapperRef = useCallback(wrapper => {
    if (wrapper == null) return;

    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    import('quill').then(mod => {
      const q = new mod.default(editor, {
        theme: 'snow',
        modules: { toolbar: TOOLBAR_OPTIONS },
      });
      setQuill(q);
    });
  }, []);

  useEffect(() => {
    if (quill == null) return;

    socket.on('notes-loaded', (delta: any) => {
      quill.setContents(delta);
      quill.enable();
    });

    socket.emit('notes-load', note);

    return () => {
      socket.off('notes-loaded');
    };
  }, [note, quill]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     socket.emit('notes-save', quill?.getContents());
  //   }, 2000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [quill]);

  useEffect(() => {
    if (quill == null) return;

    const handler = (delta: any) => {
      quill?.updateContents(delta);
    };
    socket.on('receive-changes', handler);

    return () => {
      socket.off('receive-changes', handler);
    };
  }, [quill]);

  useEffect(() => {
    if (quill == null || effectRan.current) return;
    effectRan.current = true;

    const handler = (delta: any, oldDelta: any, source: any) => {
      if (source !== 'user') return;
      socket.emit('send-changes', delta);
    };
    quill.on('text-change', handler);

    return () => {
      quill.off('text-change', handler);
    };
  }, [quill]);

  return <div ref={wrapperRef} />;
}
