export const metadata = { title: 'Quote Details' };

import QuoteDetailClient from './quoteDetailClient';

export default function QuoteDetailPage({ params }) { return <QuoteDetailClient id={params.id} />; }

