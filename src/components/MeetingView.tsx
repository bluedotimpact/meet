import Head from "next/head";
import { useEffect, useState } from "react";
import type { ZoomMtg as ZoomMtgType } from "@zoomus/websdk";
import env from "../lib/client/env";

type MeetingViewProps = {
  jwt: string,
  participantName: string,
  meetingNumber: string,
  meetingPassword: string,
}

// declare global {
//   interface Window {
//     ZoomMtg: any;
//   }
// }

declare var ZoomMtg: any;

// TODO: extract zoom 2.14.0 version
const MeetingView: React.FC<MeetingViewProps> = ({ jwt, participantName, meetingNumber, meetingPassword }) => {
  // const [ZoomMtg, setZoomMtg] = useState<typeof ZoomMtgType | undefined>();

  // This setup is based on the guide at:
  // https://developers.zoom.us/docs/meeting-sdk/web/client-view/import/#init-the-meeting-sdk
  useEffect(() => {
    // if (!ZoomMtg) {
    //   import('@zoomus/websdk').then(module => setZoomMtg(module.ZoomMtg));
    // } else {
      setTimeout(() => {
      ZoomMtg.setZoomJSLib('https://source.zoom.us/2.14.0/lib', '/av')
      ZoomMtg.preLoadWasm()
      ZoomMtg.prepareWebSDK()
      ZoomMtg.i18n.load('en-US')
      ZoomMtg.i18n.reload('en-US')

      setTimeout(() => {
        ZoomMtg.init({
          disablePreview: true,
          leaveUrl: "/finished",
          success: () => {
            ZoomMtg.join({
              sdkKey: env.NEXT_PUBLIC_ZOOM_CLIENT_ID,
              signature: jwt,
              userName: participantName,
              meetingNumber: meetingNumber,
              passWord: meetingPassword,
              success: () => {
                console.log('Joined meeting successfully')
              },
              error: (error: unknown) => {
                console.log(error)
              }
            })
          },
          error: (error: unknown) => {
            console.log(error)
          }
        })
      }, 2000)
    }, 2000)
    // }
  }, []);

  return <>
      <Head>
        {/* Scripts */}
        <script src="https://source.zoom.us/2.14.0/lib/vendor/react.min.js"></script>
        <script src="https://source.zoom.us/2.14.0/lib/vendor/react-dom.min.js"></script>
        <script src="https://source.zoom.us/2.14.0/lib/vendor/redux.min.js"></script>
        <script src="https://source.zoom.us/2.14.0/lib/vendor/redux-thunk.min.js"></script>
        <script src="https://source.zoom.us/2.14.0/lib/vendor/lodash.min.js"></script>
        <script src="https://source.zoom.us/zoom-meeting-2.14.0.min.js"></script>

        {/* Styles */}
        <link type="text/css" rel="stylesheet" href="https://source.zoom.us/2.14.0/css/bootstrap.css" />
        <link type="text/css" rel="stylesheet" href="https://source.zoom.us/2.14.0/css/react-select.css" />
      </Head>
  </>
}

export default MeetingView;