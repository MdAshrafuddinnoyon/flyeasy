import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Cookie, Loader2 } from "lucide-react";
import { Entities } from "@/lib/api";

export default function CookiePolicy() {
  const [dynamicPage, setDynamicPage] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        const pages = await Entities.pages.list();
        const found = pages.find((p) => p.slug === 'cookie-policy' && p.status === 'published');
        if (found) setDynamicPage(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (dynamicPage) {
    return (
      <div className="bg-white dark:bg-[#0a0a0c] min-h-screen pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-deep-space dark:text-white mb-8 border-b border-border dark:border-slate-800 pb-6">
            {dynamicPage.title}
          </h1>
          <div 
            className="prose dark:prose-invert prose-slate max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: dynamicPage.content }} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 sm:pt-40 pb-16 bg-slate-50 dark:bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Cookie size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-deep-space dark:text-white mb-4">Cookie Policy</h1>
          <p className="text-slate-500 dark:text-slate-400">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 sm:p-10 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 space-y-8">
          
          <section>
            <h2 className="text-xl font-bold text-deep-space dark:text-white mb-4">1. What Are Cookies?</h2>
            <p className="leading-relaxed">
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
              They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
              This international standard Cookie Policy explains how FlyEasy ("we", "us", or "our") uses cookies and similar technologies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-deep-space dark:text-white mb-4">2. How We Use Cookies</h2>
            <p className="leading-relaxed mb-4">
              We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Strictly Necessary Cookies:</strong> These are required for the operation of our website. They include, for example, cookies that enable you to log into secure areas of our website or make use of e-billing services.</li>
              <li><strong>Analytical/Performance Cookies:</strong> They allow us to recognise and count the number of visitors and to see how visitors move around our website when they are using it.</li>
              <li><strong>Functionality Cookies:</strong> These are used to recognise you when you return to our website. This enables us to personalise our content for you and remember your preferences.</li>
              <li><strong>Targeting Cookies:</strong> These cookies record your visit to our website, the pages you have visited and the links you have followed. We will use this information to make our website and the advertising displayed on it more relevant to your interests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-deep-space dark:text-white mb-4">3. Third-Party Cookies</h2>
            <p className="leading-relaxed">
              In some special cases, we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.
              We use Google Analytics which is one of the most widespread and trusted analytics solutions on the web for helping us to understand how you use the site and ways that we can improve your experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-deep-space dark:text-white mb-4">4. Managing Your Cookie Preferences</h2>
            <p className="leading-relaxed">
              You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site. Therefore, it is recommended that you do not disable cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-deep-space dark:text-white mb-4">5. More Information</h2>
            <p className="leading-relaxed">
              Hopefully, this has clarified things for you. If there is something that you aren't sure whether you need or not, it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.
              For more information about our privacy practices, please read our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl flex items-start gap-4 mt-8">
            <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-deep-space dark:text-white mb-1">We respect your privacy</h3>
              <p className="text-sm">If you have any questions about this Cookie Policy, please contact us at support@flyeasytourism.com.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
