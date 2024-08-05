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
      <DialogContent className={"p-0 w-[min(90vw,900px)] max-w-[90vw] aspect-video rounded-lg bg-transparent"}>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
