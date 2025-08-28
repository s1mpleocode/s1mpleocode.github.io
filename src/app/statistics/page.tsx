"use client";

import { config } from "@/lib/config";
import { useState, useEffect } from "react";
import { AlertCircle, BarChart3 } from "lucide-react";

export default function StatisticsPage() {
  const [isClient, setIsClient] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname.includes('localhost'));

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              网站统计
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            查看网站访问数据和统计信息
          </p>
        </div>

        {/* 开发环境提示 */}
        {isClient && isLocalhost && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  本地开发环境提示
                </p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  统计仪表板在本地环境可能无法正常显示，这是正常现象。部署到生产环境后即可正常访问。
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="w-full h-[600px] border rounded-lg overflow-hidden relative">
            <iframe
              src={config.umami.dashboardUrl}
              className="w-full h-full border-0"
              title="网站统计数据"
              loading="lazy"
              onError={() => setShowError(true)}
            />
            
            {/* 错误提示覆盖层 */}
            {showError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center p-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    统计数据暂时无法显示
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    请部署到生产环境后查看统计数据
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>



        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            统计数据由{" "}
            <a
              href="https://umami.is/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Umami
            </a>{" "}
            提供
          </p>
        </div>
      </div>
    </main>
  );
}
