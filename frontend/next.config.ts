// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    env: {
        NEXT_PUBLIC_API_HOST:
            process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:3001',
    },
};

export default nextConfig;
