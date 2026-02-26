/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/asset-zones/zone-a-workforce-housing", destination: "/asset-zones/zone-a", permanent: true },
      { source: "/asset-zones/zone-b-auto-services", destination: "/asset-zones/zone-b", permanent: true },
    ];
  },
};

export default nextConfig;
