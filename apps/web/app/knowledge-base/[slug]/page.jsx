export const metadata = { title: 'KB Article' };

import KBDetailServer from './server';

export default function KBDetailPage({ params }){ return <KBDetailServer slug={params.slug} />; }

