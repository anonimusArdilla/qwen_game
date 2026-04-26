import { themeStorageKey } from "@/lib/theme"

export function ThemeScript() {
  const code = `(function(){try{var k=${JSON.stringify(
    themeStorageKey
  )};var p=localStorage.getItem(k)||"system";var m=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)");var s=!!(m&&m.matches);var d=p==="dark"||(p!=="light"&&s);var r=document.documentElement;r.dataset.theme=p;r.classList.toggle("dark",d);}catch(e){}})();`

  return <script dangerouslySetInnerHTML={{ __html: code }} />
}
