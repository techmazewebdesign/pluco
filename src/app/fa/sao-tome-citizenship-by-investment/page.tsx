import Link from 'next/link';
import { SaoTomeCitizenshipView } from '@/app/sao-tome-citizenship-by-investment/page';
import { saoTomeEditorial } from '@/lib/saoTomeEditorial';

export default function FarsiSaoTomeCitizenshipPage() {
  return (
    <>
      <SaoTomeCitizenshipView forceLanguage="fa" />
      <section dir="rtl" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">راهنماها و اخبار تابعیت سائوتومه و پرنسیپ</h2>
        <ul className="mt-5 space-y-3">
          {Object.values(saoTomeEditorial).map(article => (
            <li key={article.path}><Link href={article.path} className="underline underline-offset-4">{article.title}</Link></li>
          ))}
        </ul>
      </section>
    </>
  );
}
