import { Dialog } from "@headlessui/react";

const AuthModalWrapper = ({ isOpen, onClose, children }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50"
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fadeIn">
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AuthModalWrapper;


