import { supabase } from "@/lib/supabase";
import Script from "next/script";

export default async function TrackingInjector() {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("tracking_config, site_name, site_description")
      .single();
    
    if (error || !data) {
      return null;
    }

    const { tracking_config } = data;
    const { 
      google_analytics_id, 
      google_ads_id, 
      facebook_pixel_id, 
      custom_js 
    } = tracking_config || {};

    return (
      <>

        {/* Google Analytics 4 */}
        {google_analytics_id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${google_analytics_id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${google_analytics_id}');
              `}
            </Script>
          </>
        )}

        {/* Google Ads */}
        {google_ads_id && (
          <Script id="google-ads-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${google_ads_id}');
            `}
          </Script>
        )}

        {/* Facebook Pixel */}
        {facebook_pixel_id && (
          <Script id="fb-pixel-init" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${facebook_pixel_id}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        {/* Custom Global JS */}
        {custom_js && (
          <Script id="custom-global-js" strategy="afterInteractive">
            {custom_js.replace(/<script>|<\/script>/gi, '')}
          </Script>
        )}
      </>
    );
  } catch (err) {
    console.error("TrackingInjector Error:", err);
    return null;
  }
}
