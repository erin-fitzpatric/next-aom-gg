import { Spinner, SpinnerWithText } from "./spinner";

interface LoadingProps {
  text?: string;
}

export default function Loading({ text }: LoadingProps) {
  return (
    <div className="flex justify-center mt-4">
      {text ? (
        <SpinnerWithText text={text} />
      ) : (
        <Spinner />
      )}
    </div>
  );
}
