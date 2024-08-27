import DownloadFile from "./downloadFile";
import { Card } from "./ui/card";

export default function ResourcesPage() {
  return (
    <>
      <Card className="p-4 mx-4 sm:mx-8 md:mx-16 lg:mx-32">
        {/* header */}
        <div className="card-header">
          <h2>Hotkeys</h2>
        </div>

        {/* content */}
        <div className="mt-2">
          <div className="overflow-x-auto">
            <table className="table-auto w-full min-w-full">
              <tbody>
                <tr className="bg-muted">
                  <td className="p-2">
                    <div className="flex items-center justify-between">
                      <span>FitzBro&#39;s AoM Retold Hotkeys</span>
                      <DownloadFile fileName={"FitzLocalKeybindings.xml"} />
                    </div>
                  </td>
                </tr>
                <tr className="bg-inherit">
                  <td className="p-2">
                    <div className="flex items-center justify-between">
                      <span>Boit&#39;s AoM Retold Hotkeys</span>
                      <DownloadFile fileName={"BoitLocalKeybindings.xml"} />
                    </div>
                  </td>
                </tr>
                <tr className="bg-muted">
                  <td className="p-2">
                    <div className="flex items-center justify-between">
                      <span>Drongo&#39;s AoM Retold Hotkeys</span>
                      <DownloadFile fileName={"DrongoLocalKeybindings.xml"} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
      <Card className="p-4 mt-4 mx-4 sm:mx-8 md:mx-16 lg:mx-32">
        {/* instructions */}
        <div className="card-header">
          <h2>Instructions</h2>
        </div>
        <div className="mt-2">
          <ol className="list-decimal pl-4 sm:pl-6">
            <li className="mb-2">
              Save the hotkey file to:
              <code className="block mt-1 whitespace-pre-wrap break-words">
                C:\Users\yourUserName\Games\Age of Mythology Retold\yourSteamIdHere\users
              </code>
            </li>
            <li>
              Rename the file to <code>localKeybindings.xml</code> before saving.
            </li>
          </ol>
        </div>
      </Card>
    </>
  );
}
