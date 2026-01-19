'use client';

import { useState, useEffect } from 'react';

/**
 * Type ของข้อมูลจาก API /attractions
 * ปรับ field ให้ตรงกับ database / backend ของคุณได้
 */
interface Attraction {
    id: number;
    name: string;
    coverimage?: string | null;
    detail?: string | null;
    latitude?: number | null;
    longitude?: number | null;
}

export default function Page() {
    const [rows, setRows] = useState<Attraction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const portt = process.argv[2] || 3001;

    console.log(`Received request at ${portt}`);

    useEffect(() => {
        async function getAttractions() {
            try {
                const apiHost = process.env.NEXT_PUBLIC_API_HOST;

                if (!apiHost) {
                    throw new Error('API host is not configured');
                }

                const res = await fetch(`${apiHost}/attractions`, {
                    cache: 'no-store',
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.status}`);
                }

                const data: Attraction[] = await res.json();
                setRows(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Unknown error');
                }
            } finally {
                setLoading(false);
            }
        }

        getAttractions();
    }, []);

    if (loading) {
        return (
            <main className="container">
                <div className="empty">Loading...</div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="container">
                <div className="empty">Error: {error}</div>
            </main>
        );
    }

    return (
        <main className="container">
            <header className="header">
                <h1 className="title">Attractions</h1>
                <p className="subtitle">Discover points of interest nearby</p>
            </header>

            {rows.length === 0 ? (
                <div className="empty">No attractions found.</div>
            ) : (
                <section className="grid" aria-live="polite">
                    {rows.map((x) => (
                        <article key={x.id} className="card" tabIndex={0}>
                            {x.coverimage && (
                                <div className="media">
                                    <img
                                        src={x.coverimage}
                                        alt={x.name}
                                        className="img"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                            )}

                            <div className="body">
                                <h3 className="card-title">{x.name}</h3>

                                {x.detail && (
                                    <p className="detail">{x.detail}</p>
                                )}

                                <div className="meta">
                                    <small>
                                        Lat:{' '}
                                        <span className="code">
                                            {x.latitude ?? '-'}
                                        </span>{' '}
                                        · Lng:{' '}
                                        <span className="code">
                                            {x.longitude ?? '-'}
                                        </span>
                                    </small>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}
