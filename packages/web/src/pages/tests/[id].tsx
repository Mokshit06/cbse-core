// declare module 'webgazer' {
//   const mod: any;
//   export default mod;
// }
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { useToast } from '@chakra-ui/react';

export default function Test() {
  const router = useRouter();
  const toast = useToast();
  const totalWarnings = useRef(0);
  const hasError = useRef(false);
  const didBlur = useRef(false);
  const testId = router.query.id as string;
  // const { data: test, status } = useQuery(['/tests', testId], {
  //   enabled: !!testId,
  // });

  useEffect(() => {
    const focusHandler = () => {
      console.log('FOCUS', didBlur.current);
      if (didBlur.current) {
        toast({
          title: 'Kindly focus on the test',
          description: `You were detected to have opened a new tab or switched window`,
          status: 'warning',
          isClosable: true,
        });

        didBlur.current = false;
      }
    };
    const blurHandler = () => {
      console.log('BLUR');
      didBlur.current = true;
    };

    window.addEventListener('focus', focusHandler);
    window.addEventListener('blur', blurHandler);

    return () => {
      window.removeEventListener('focus', focusHandler);
      window.removeEventListener('blur', blurHandler);
    };
  }, [toast]);

  useEffect(() => {
    if ((window as any).webgazer == null) return;

    const webgazer = (window as any).webgazer;

    webgazer
      .setRegression('ridge')
      .setGazeListener(
        (data: { x: number; y: number }, elapsedTime: number) => {
          if (data == null) {
            if (!hasError.current) {
              hasError.current = true;
              totalWarnings.current++;

              if (totalWarnings.current > 3) {
                toast({
                  title: 'The teacher incharge has been alerted about you',
                  description: `You were detected to be looking away from screen more than 3 times`,
                  status: 'error',
                  isClosable: true,
                });

                webgazer.pause();
                return;
              }
              toast({
                title: 'Kindly focus on the test!',
                description: `You were detected to be looking away from screen`,
                status: 'warning',
                isClosable: true,
              });
            }

            return;
          }

          hasError.current = false;
        }
      )
      .saveDataAcrossSessions(true)
      .begin();

    // start calibration
    document.body.click();

    webgazer.showPredictionPoints(true).showVideoPreview(true);
  }, [toast]);

  // if (status !== 'success' || !test) {
  //   return null;
  // }

  return (
    <>
      <Script src="/w.js" type="text/javascript" strategy="beforeInteractive" />
      <pre>{JSON.stringify({}, null, 2)}</pre>
    </>
  );
}

function TestQuestions() {}
