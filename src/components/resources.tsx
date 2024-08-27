import DownloadFile from "./downloadFile";
import { Card } from "./ui/card";
export default function ResourcesPage() {
  return (
    <>
      <Card className="p-4">
        {/* header */}
        <div className="card-header">
          <h2>Hotkeys</h2>
        </div>

        {/* content */}
        <div className="flex mt-2">
          <div className="flex flex-col mx-auto">
            <ul className="list-disc list-inside">
              <li className="flex">
                <div>FitzBro&#39;s AoM Retold Hotkeys</div>
                <DownloadFile fileName={"FitzLocalKeybindings.xml"} />
              </li>
              <li className="flex">
                <div>Boit&#39;s AoM Retold Hotkeys</div>
                <DownloadFile fileName={"BoitLocalKeybindings.xml"} />
              </li>
              <li className="flex">
                <div>Drongo&#39;s AoM Retold Hotkeys</div>
                <DownloadFile fileName={"DrongoLocalKeybindings.xml"} />
              </li>
            </ul>
          </div>
        </div>
        {/* instructions */}
        <div className="flex">
          <p className="mx-auto text-gold">
            Where to save the hotkey file:
            &nbsp;
            <code>
            C:\Users\efitz\Games\Age of Mythology Retold\76561198066400845\users
            </code>
          </p>
        </div>
      </Card>
    </>
  );
}
