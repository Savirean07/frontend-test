import { useContext } from "react";
import { MdAdd } from "react-icons/md";
import {
  CloudLinks,
  FileUpload,
  Modal,
  ScraperToolLinks,
  WindowHeaderBar,
} from "src/components/ui";
import { EmailGeneratorContext } from "src/contexts";

const AddNewFile = () => {
  const {
    fileManager: { setOpenAddFileWindow, openAddFileWindow },
  } = useContext(EmailGeneratorContext);

  if (!openAddFileWindow) return null;

  return (
    <Modal>
      <WindowHeaderBar
        title="Add New File"
        icon={<MdAdd />}
        onClose={() => {
          setOpenAddFileWindow(false);
        }}
        closeButtonText="Cancel"
      />
      <div className="flex flex-col gap-4 p-4 min-w-[400px]">
        <FileUpload />
        <CloudLinks />
        <ScraperToolLinks />
      </div>
    </Modal>
  );
};

export default AddNewFile;
