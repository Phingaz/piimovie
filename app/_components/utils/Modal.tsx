import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import React from "react";

const Modal = ({
  content,
  trigger,
}: {
  content: React.ReactNode;
  trigger: React.ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger className={"w-full h-full"}>{trigger}</DialogTrigger>
      <DialogContent
        className={
          "p-0 min-w-[min(90vw,700px)] max-w-[90vw] min-h-[min(50vh,700px)] max-h-[50svh] md:max-h-[90svh] rounded-lg bg-transparent"
        }
      >
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
