import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Entities } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function CustomPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const pages = await Entities.pages.list();
        const found = pages.find((p) => p.slug === slug && p.status === 'published');
        if (found) {
          setPage(found);
        } else {
          navigate('/404', { replace: true });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0c]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!page) return null;

  return (
    <div className="bg-white dark:bg-[#0a0a0c] min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-5xl font-bold text-deep-space dark:text-white mb-8 border-b border-border dark:border-slate-800 pb-6">
          {page.title}
        </h1>
        <div 
          className="prose dark:prose-invert prose-slate max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: page.content }} 
        />
      </div>
    </div>
  );
}
