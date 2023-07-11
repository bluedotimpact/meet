import Head from "next/head";
import { useEffect, useState } from "react";
import env from "../lib/client/env";
import type { EmbeddedClient } from "@zoomus/websdk/embedded";

type MeetingViewProps = {
  jwt: string,
  participantName: string,
  meetingNumber: string,
  meetingPassword: string,
}

// TODO: extract zoom 2.14.0 version
const MeetingView: React.FC<MeetingViewProps> = ({ jwt, participantName, meetingNumber, meetingPassword }) => {
  const [ZoomMtg, setZoomMtg] = useState<typeof EmbeddedClient | undefined>();

  // This setup is based on the guide at:
  // https://developers.zoom.us/docs/meeting-sdk/web/client-view/import/#init-the-meeting-sdk
  useEffect(() => {
    if (!ZoomMtg) {
      import('@zoomus/websdk/embedded').then(module => setZoomMtg(module.default.createClient()));
    } else {
      setTimeout(() => {
        ZoomMtg.init({
          zoomAppRoot: document.getElementById('meetingSDKElement')!,
          language: 'en-US',
          customize: {
            video: {
              isResizable: false,
            }
          }
        })

        ZoomMtg.join({
          sdkKey: env.NEXT_PUBLIC_ZOOM_CLIENT_ID,
          signature: jwt,
          userName: participantName,
          meetingNumber: meetingNumber,
          password: meetingPassword,
        })

        // disablePreview: true,
        //   leaveUrl: "/finished",
        //   success: () => {
        //     ZoomMtg.join({
        //       sdkKey: env.NEXT_PUBLIC_ZOOM_CLIENT_ID,
        //       signature: jwt,
        //       userName: participantName,
        //       meetingNumber: meetingNumber,
        //       passWord: meetingPassword,
        //       success: () => {
        //         console.log('Joined meeting successfully')
        //       },
        //       error: (error: unknown) => {
        //         console.log(error)
        //       }
        //     })
      }, 1000)
    }
  }, [ZoomMtg]);

  if (!ZoomMtg) {
    return <p>Loading...</p>
  }

  return <>
      <Head>
        {/* <link type="text/css" rel="stylesheet" href="https://source.zoom.us/2.14.0/css/bootstrap.css" />
        <link type="text/css" rel="stylesheet" href="https://source.zoom.us/2.14.0/css/react-select.css" /> */}
      </Head>
      <div id="meetingSDKElement"></div>
  </>
}

export default MeetingView;