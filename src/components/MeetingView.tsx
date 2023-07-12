import type { ZoomMtg as ZoomMtgType } from "@zoomus/websdk";
import env from "../lib/client/env";
import Script from "next/script";

type MeetingViewProps = {
  jwt: string,
  participantName: string,
  meetingNumber: string,
  meetingPassword: string,
}

const ZOOM_VERSION = "2.14.0"

declare var ZoomMtg: typeof ZoomMtgType;

const MeetingView: React.FC<MeetingViewProps> = ({ jwt, participantName, meetingNumber, meetingPassword }) => {
  // This setup is based on the guide at:
  // https://developers.zoom.us/docs/meeting-sdk/web/client-view/import/#init-the-meeting-sdk
  const onZoomLoad = () => {
    ZoomMtg.setZoomJSLib(`https://source.zoom.us/${ZOOM_VERSION}/lib`, '/av')
    ZoomMtg.preLoadWasm()
    ZoomMtg.prepareWebSDK()
    ZoomMtg.i18n.load('en-US')
    ZoomMtg.i18n.reload('en-US')

    ZoomMtg.init({
      disablePreview: true,
      disableInvite: true,
      leaveUrl: `/finished${window.location.search}`,
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
            console.log('Error joining meeting', error)
          }
        })
      },
      error: (error: unknown) => {
        console.log('Error initializing Zoom client', error)
      }
    })
  }

  return <>
    <div>
      {/* Scripts */}
      <Script src={`https://source.zoom.us/${ZOOM_VERSION}/lib/vendor/react.min.js`} async={false}/>
      <Script src={`https://source.zoom.us/${ZOOM_VERSION}/lib/vendor/react-dom.min.js`} async={false} />
      <Script src={`https://source.zoom.us/${ZOOM_VERSION}/lib/vendor/redux.min.js`} async={false}/>
      <Script src={`https://source.zoom.us/${ZOOM_VERSION}/lib/vendor/redux-thunk.min.js`} async={false} />
      <Script src={`https://source.zoom.us/${ZOOM_VERSION}/lib/vendor/lodash.min.js`} async={false} />
      <Script src={`https://source.zoom.us/zoom-meeting-${ZOOM_VERSION}.min.js`} async={false} onLoad={onZoomLoad} />

      {/* Styles */}
      <link type="text/css" rel="stylesheet" href={`https://source.zoom.us/${ZOOM_VERSION}/css/bootstrap.css`} />
      <link type="text/css" rel="stylesheet" href={`https://source.zoom.us/${ZOOM_VERSION}/css/react-select.css`} />
    </div>
  </>
}

export default MeetingView;