export default function StyleTest() {
  return (
    <div className="p-8">

        <section className="m-8">
          <h3 className="mb-4 text-primary">層級樣式</h3>
          
          {/* 標題樣式 */}
          <div className="mb-8">
            <div >
              <h1 >H1 頁面主標</h1>
              <h2 >H2 區塊標題</h2>
              <h3 >H3 段落小標</h3>
              <br />
              <p >p 正文樣式 - 這是使用自定義正文樣式的文字，適合用於主要內容區域。</p>
              <a href="#">a 連結樣式</a>
              <br />
              <br />
              <p className="text-2xl">text-2xl</p>
              <p className="text-xl">text-xl</p>
              <p className="text-lg">text-lg</p>
              <p className="text-base">text-base</p>
              <p className="text-sm">text-sm</p>
              <p className="text-xs">text-xs</p>
            </div>
          </div>


          {/* 顏色文字 */}
          <div className="mb-8">
            <h3 className="mb-4 text-primary">文字顏色</h3>
            <div className="">
              <p className="text-textDefaultColor">text-textDefaultColor</p>
              <p className="text-muted">text-muted</p>
              <p className="text-sub">text-sub</p>
              <p className="text-light">text-light</p>
              <p className="text-emphasized">text-emphasized</p>
              <br />
              <p className="text-primary">text-primary</p>
              <p className="text-primary-strong">text-primary-strong</p>
              <p className="text-primary-hover">text-primary-hover</p>
              <p className="text-secondary">text-secondary</p>
              <p className="text-link">text-link</p>
              <p className="text-link-hover">text-link-hover</p>

            </div>
          </div>

          {/* 字重樣式 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-[var(--text-main)]">字重樣式</h3>
            <div className="space-y-2">
              <p className="font-light">字重 Light（font-light）</p>
              <p className="font-normal">字重 Normal（font-normal）</p>
              <p className="font-medium">字重 Medium（font-medium）</p>
              <p className="font-semibold">字重 Semibold（font-semibold）</p>
              <p className="font-bold">字重 Bold（font-bold）</p>
            </div>
          </div>
        </section>

        {/* 卡片樣式測試 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--text-main)]">卡片樣式</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">卡片標題</h3>
              <p className="text-gray-600">這是卡片內容的描述文字</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">卡片標題</h3>
              <p className="text-gray-600">這是卡片內容的描述文字</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">卡片標題</h3>
              <p className="text-gray-600">這是卡片內容的描述文字</p>
            </div>
          </div>
        </section>

        {/* 表單樣式測試 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--text-main)]">表單樣式</h2>
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">輸入框</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="請輸入文字"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">文字區域</label>
              <textarea 
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
                placeholder="請輸入多行文字"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">選擇框</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>選項 1</option>
                <option>選項 2</option>
                <option>選項 3</option>
              </select>
            </div>
          </div>
        </section>

        {/* 顏色測試 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--text-main)]">顏色測試</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary h-24 rounded flex items-center justify-center text-white">
              Primary
            </div>
            <div className="bg-secondary h-24 rounded flex items-center justify-center text-white">
              Secondary
            </div>
            <div className="bg-link h-24 rounded flex items-center justify-center text-white">
              Link
            </div>
            <div className="bg-link-hover h-24 rounded flex items-center justify-center text-white">
              Link Hover
            </div>
          </div>
        </section>

        {/* 間距測試 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--text-main)]">間距測試</h2>
          <div className="space-y-4">
            <div className="p-2 bg-gray-100">p-2 (0.5rem)</div>
            <div className="p-4 bg-gray-100">p-4 (1rem)</div>
            <div className="p-6 bg-gray-100">p-6 (1.5rem)</div>
            <div className="p-8 bg-gray-100">p-8 (2rem)</div>
          </div>
        </section>

    </div>
  )
}

