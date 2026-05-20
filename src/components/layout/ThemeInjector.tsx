import { supabase } from "@/lib/supabase";

export default async function ThemeInjector() {
  try {
    const { data, error } = await supabase.from("site_settings").select("theme_config, favicon_url, favicon_dark_url").single();
    
    if (error || !data?.theme_config) {
      console.warn("ThemeInjector: No theme_config found, using defaults.");
      // Even if theme_config is missing, we might still have favicons
    }

    const theme = data?.theme_config || {};
    const { colors = {}, typography = {}, ui = {}, effects = {} } = theme;

    // Tránh lỗi khi typography bị thiếu
    const headingFont = typography?.heading_font || "Inter";
    const bodyFont = typography?.body_font || "Inter";

    // Extract font names for Google Fonts injection
    const fonts = [headingFont, bodyFont]
      .map(f => f.split(',')[0].replace(/['"]/g, '').replace(/ /g, '+'))
      .filter((v, i, a) => a.indexOf(v) === i); // Unique fonts

    const googleFontsUrl = `https://fonts.googleapis.com/css2?${fonts.map(f => `family=${f}:wght@400;500;600;700;800;900`).join('&')}&display=swap`;

    // Shadow configurations safely
    const shadowStyle = ui?.shadow_style || 'soft';
    const shadowsMap: any = {
      soft: {
        sm: '0 1px 2px rgba(16, 24, 40, 0.05)',
        md: '0 4px 6px -1px rgba(16, 24, 40, 0.06), 0 2px 4px -2px rgba(16, 24, 40, 0.06)',
        lg: '0 10px 15px -3px rgba(16, 24, 40, 0.08), 0 4px 6px -4px rgba(16, 24, 40, 0.08)'
      },
      sharp: {
        sm: '0 1px 1px rgba(0,0,0,0.1)',
        md: '0 4px 0px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
        lg: '0 8px 0px rgba(0,0,0,0.03), 0 4px 8px rgba(0,0,0,0.1)'
      },
      deep: {
        sm: '0 2px 4px rgba(0,0,0,0.1)',
        md: '0 12px 24px -4px rgba(0,0,0,0.12), 0 4px 8px -2px rgba(0,0,0,0.08)',
        lg: '0 25px 50px -12px rgba(0,0,0,0.25)'
      },
      none: { sm: 'none', md: 'none', lg: 'none' }
    };
    
    const shadows = shadowsMap[shadowStyle] || shadowsMap.soft;

    return (
      <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={googleFontsUrl} rel="stylesheet" />



        <style id="dynamic-theme">
          {`
            :root {
              ${colors?.primary ? `--primary: ${colors.primary};` : ''}
              ${colors?.accent ? `--accent: ${colors.accent};` : ''}
              ${colors?.secondary ? `--secondary: ${colors.secondary};` : ''}
              ${colors?.background ? `--background: ${colors.background};` : ''}
              ${colors?.foreground ? `--foreground: ${colors.foreground};` : ''}
              
              --font-heading: ${headingFont};
              --font-body: ${bodyFont};
              --h1-weight: ${typography?.h1_weight || '900'};
              --h2-weight: ${typography?.h2_weight || '800'};
              --h3-weight: ${typography?.h3_weight || '700'};
              --base-font-size: ${typography?.base_size || '16px'};
              
              ${ui?.radius ? `
                --radius: ${ui.radius};
                --radius-sm: calc(${ui.radius} * 0.5);
                --radius-md: ${ui.radius};
                --radius-lg: calc(${ui.radius} * 1.5);
              ` : ''}

              ${shadows.sm ? `--shadow-sm: ${shadows.sm};` : ''}
              ${shadows.md ? `--shadow-md: ${shadows.md};` : ''}
              ${shadows.lg ? `--shadow-lg: ${shadows.lg};` : ''}

              ${effects?.marquee_speed ? `--duration: ${effects.marquee_speed};` : ''}
            }

            body {
              font-family: var(--font-body, "Inter", sans-serif);
              font-size: var(--base-font-size, 16px);
            }

            h1, h2, h3, h4, h5, h6 {
              font-family: var(--font-heading, var(--font-body, "Inter", sans-serif));
            }

            h1 { font-weight: var(--h1-weight, 900); }
            h2 { font-weight: var(--h2-weight, 800); }
            h3 { font-weight: var(--h3-weight, 700); }
            h4, h5, h6 { font-weight: var(--h3-weight, 700); }
          `}
        </style>
      </>
    );
  } catch (err) {
    console.error("ThemeInjector Critical Error:", err);
    return null;
  }
}
