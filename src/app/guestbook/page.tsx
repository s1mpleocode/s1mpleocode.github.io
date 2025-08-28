import { type Metadata } from "next";
import { config } from "@/lib/config";
import GiscusComments from "@/components/giscus-comments";

export const metadata: Metadata = {
  title: `留言板 | ${config.site.title}`,
  description: `欢迎在 ${config.site.title} 的留言板留下你的足迹`,
  keywords: `${config.site.title}, 留言板, guestbook, 留言`,
};

export default function GuestbookPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">留言板</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed mb-6">
            欢迎来到我的留言板！这里是一个自由交流的空间，你可以：
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-3">💬 分享想法</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                分享你对技术的见解、对文章的看法，或者任何有趣的想法
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border border-green-100 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-3">🤝 建立联系</h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                认识志同道合的朋友，一起探讨技术话题，交流学习经验
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg border border-purple-100 dark:border-purple-800">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-3">💡 提出建议</h3>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                对博客内容或网站功能有什么建议？我很乐意听取你的意见
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-lg border border-orange-100 dark:border-orange-800">
              <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-300 mb-3">🎉 随意聊天</h3>
              <p className="text-sm text-orange-600 dark:text-orange-400">
                生活趣事、技术感悟、学习心得... 什么都可以聊
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500 mb-8">
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">💝 留言小贴士</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• 支持 Markdown 语法，可以使用代码块、链接等格式</li>
              <li>• 请保持友善和尊重，营造良好的交流氛围</li>
              <li>• 欢迎提出问题，我会尽量及时回复</li>
              <li>• 可以分享你的 GitHub、博客等社交链接</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 留言评论区 */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span>💌</span>
          <span>开始留言</span>
        </h2>
        <GiscusComments />
      </div>
    </div>
  );
}
