'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TypeFromSearchParams from './TypeFromSearchParams';
import Loader from '@/components/Loader';

interface LogEntry {
  _id: string;
  type: string;
  entry: string;
  createdAt: string;
  updatedAt?: string;
}

export default function ViewLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [type, setType] = useState<string | null>(null);


  //const searchParams = useSearchParams();
  //const type = searchParams!.get('type') || 'location'; // The bang should not actually be there, but I couldn't get the error to go away

  useEffect(() => {
    async function fetchLogs() {
      if (!type) {
        //setError('Missing log type');
        //setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/adventurelog?type=${type}`, { cache: 'no-store' });
        if (res.status === 401) {
            router.push('/login');
        } else if (!res.ok) {
          throw new Error('Failed to fetch logs'); 
        }

        const data = await res.json();
        setLogs(data);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message || 'Unknown error');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [type, router]);

  useEffect(() => {
    if (selectedLog) {
        setEditMode(false);
        setEditedText(selectedLog.entry);
    }
  }, [selectedLog]);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this log?');
    if (!confirm) return;

    try {
        const res = await fetch(`/api/adventurelog/${id}`, {
        method: 'DELETE',
        });

        if (res.status === 401) {
        // handled later
        setError('You must be logged in to delete a log.');
        return;
        }

        if (!res.ok) {
        const { message } = await res.json();
        setError(message || 'Failed to delete log');
        return;
        }

        // Remove the deleted log from local state
        setLogs((prev) => prev.filter((log) => log._id !== id));
        setSelectedLog(null); // close modal
    } catch (err: unknown) {
        console.error('Error deleting log:', err);
        setError('Unexpected error during deletion.');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
        const res = await fetch(`/api/adventurelog/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entry: editedText }),
        });

        if (res.status === 401) {
        setError('You must be logged in to update a log.');
        return;
        }

        if (!res.ok) {
        const { message } = await res.json();
        setError(message || 'Failed to update log');
        return;
        }

        // Update the log in state
        const updatedLog = await res.json();
        setLogs((prev) =>
        prev.map((log) => (log._id === id ? updatedLog : log))
        );
        setSelectedLog(updatedLog);
        setEditMode(false);
    } catch (err: unknown) {
        console.error('Update failed:', err);
        setError('Unexpected error during update.');
    }
    };



  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 capitalize">{type ? `${type} Logs` : 'Loading...'}</h2>
      <Suspense fallback={<Loader />}>
        <TypeFromSearchParams onResolved={setType} />
      </Suspense>

      {loading && <Loader />}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {!loading && !error && logs.length === 0 && (
        <p>No logs found for this category.</p>
      )}

      {!loading && logs.length > 0 && (
        <div className="space-y-4">
            {logs.map((log) => (
                <div key={log._id} className='log-entry cursor-pointer' onClick={() => setSelectedLog(log)}>
                    <h4>{log.type}</h4>
                    <p>
                        {log.entry.length > 120
                        ? log.entry.slice(0,120) + '...'
                        : log.entry}
                    </p>
                    <small className='text-gray-500'>
                        {new Date(log.createdAt).toLocaleString()}
                    </small>
                </div>
            ))}
        </div>
      )}
      {selectedLog && (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={() => setSelectedLog(null)}>✖</button>
                <h3 className="modal-title">{selectedLog.type}</h3>

                {editMode ? (
                    <textarea
                    className='w-full border border-gray-300 p-2 rounded text-sm'
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    rows={10}
                    />
                ) : (
                    <p className="modal-body">{selectedLog.entry}</p>
                )}
                <div className="modal-actions">
                    {editMode ? (
                        <>
                            <button className='btn btn-secondary' onClick={() => setEditMode(false)}>Cancel</button>
                            <button className='btn btn-primary' onClick={() => handleUpdate(selectedLog._id)}>Save</button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn-secondary" onClick={() => handleDelete(selectedLog._id)}>Delete</button>
                            <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edit</button>
                        </>
                    )}  
                </div>
            </div>
        </div>
        )}
    </div>
    
  );
}
