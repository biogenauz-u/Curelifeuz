/**
 * Server-rendered JSON-LD. `<script>` ichidagi `</script>` ketma-ketligi
 * (va umuman `<`) qochirib chiqariladi — aks holda structured data ichiga
 * yashiringan matn HTML'ni yopib, XSS ochishi mumkin edi.
 */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
