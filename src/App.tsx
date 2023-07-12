import { createSignal, type Component } from "solid-js";
import YAML from "yaml";
import { update } from "./updater";

function downloadFile(name: string, contents: string, mime_type?: string) {
  mime_type = mime_type || "text/plain";

  const blob = new Blob([contents], { type: mime_type });

  const dlink = document.createElement("a");
  dlink.download = name;
  dlink.href = window.URL.createObjectURL(blob);
  dlink.onclick = function (e) {
    // revokeObjectURL needs a delay to work properly
    setTimeout(function () {
      window.URL.revokeObjectURL(dlink.href);
    }, 1500);
  };

  dlink.click();
  dlink.remove();
}

const App: Component = () => {
  const [curFile, setCurFile] = createSignal<File | null>(null);
  const [result, setResult] = createSignal<string>("");
  function handleChange(event: any) {
    const reader = new FileReader();
    const file = event?.target?.files?.[0];
    if (!file) return;

    setCurFile(file);

    reader.readAsText(file);

    reader.onload = (event) => {
      const strData = event.target?.result;
      const data = YAML.parse(strData as string);
      const newData = update(data);
      const yamlStr = YAML.stringify(newData);

      setResult(yamlStr);
    };

    reader.onerror = (event) => {
      console.log("error", event.target?.error);
    };
  }

  function handleDownload() {
    const name = curFile()?.name || "updated.ctflow";
    downloadFile(name, result());
  }

  return (
    <section>
      <div class="text-3xl font-bold text-center pt-4">File updater</div>
      <div class="text-center">CTflow version: 0.7.1</div>
      <div class="pt-8">
        <div class="flex items-center justify-center w-1/2 mx-auto">
          <label
            for="dropzone-file"
            class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 hover:border-red-500"
          >
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p class="mb-2 text-sm text-gray-600">
                <span class="font-semibold">Click to upload</span>
              </p>

              <p class="text-xs text-gray-600">.ctflow file</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              class="hidden"
              onChange={handleChange}
            />
          </label>
        </div>
      </div>
      {result() && (
        <div class="mt-8">
          <button
            type="button"
            class="block mx-auto focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      )}
    </section>
  );
};

export default App;
