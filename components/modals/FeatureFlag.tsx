import React from 'react';
import ModalComponent from '../general/Modal';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { FlagIcon, Trash2Icon } from 'lucide-react';
import { useDbPropsCtx } from '@/app/_context/DbProps';
import { addFeatureFlag, deleteFeatureFlag, toggleFeatureFlag } from '@/app/queries/dbProps';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const FeatureFlag = () => {
  const router = useRouter();
  const { featureFlags } = useDbPropsCtx();
  const [open, setOpen] = React.useState(false);
  const [featureName, setFeatureName] = React.useState('');

  const handleAddToFilter = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!featureName) {
      toast.error('Please enter a feature name');
      return;
    }

    await addFeatureFlag(featureName);
    toast.success('Feature flag added successfully!');
    setFeatureName('');
    router.refresh();
  };

  const handleToggleFeatureFlag = async (id: string) => {
    await toggleFeatureFlag(id);
    toast.success('Feature flag updated successfully!');
    router.refresh();
  };

  const handleDeleteFeatureFlag = async (id: string) => {
    await deleteFeatureFlag(id);
    toast.success('Feature flag deleted successfully!');
    router.refresh();
  };

  return (
    <ModalComponent
      open={open}
      setOpen={setOpen}
      title="Feature Flags"
      description="Enable or disable features in the app."
      trigger={
        <Button variant="dropdown" className="has-[>svg]:px-0 p-0 h-fit justify-start">
          <FlagIcon strokeWidth={2} size={25} />
          Feature Flags
        </Button>
      }
    >
      <div className="space-y-6">
        <ul className="flex gap-2 flex-col">
          {featureFlags?.map((el) => {
            return (
              <li key={el.id} className="flex items-center space-x-2 justify-between">
                <span className="flex items-center gap-3">
                  <Switch
                    id={el.id}
                    checked={el.enabled}
                    onCheckedChange={async () => await handleToggleFeatureFlag(el.id)}
                  />
                  <label htmlFor={el.name}>{el.name}</label>
                </span>

                <Trash2Icon
                  strokeWidth={2}
                  size={20}
                  className="text-red-600 cursor-pointer "
                  onClick={() => handleDeleteFeatureFlag(el.id)}
                />
              </li>
            );
          })}
        </ul>

        <form className="border border-dashed border-gray-500/50 rounded-md p-2">
          <div className="flex flex-col gap-2 mb-3">
            <label htmlFor="feature-name" className="text-gray-300 text-sm">
              Add a new feature flag
            </label>
            <p className="text-xs text-gray-400">
              Make sure to use a unique name that is not already in use, and camelCase.
            </p>
            <input
              type="text"
              id="feature-name"
              value={featureName}
              autoComplete="off"
              onChange={(e) => setFeatureName(e.target.value)}
              className="bg-gray-800/50 border border-gray-500/50 rounded-md p-2 placeholder:text-gray-400 text-gray-300 placeholder:text-sm px-3 outline-none"
              placeholder="Enter feature name"
            />
          </div>
          <Button
            type="submit"
            onClick={handleAddToFilter}
            className="w-full bg-gray-800/30 border border-gray-500/50 hover:bg-gray-800"
          >
            Add feature flag
          </Button>
        </form>
      </div>
    </ModalComponent>
  );
};

export default FeatureFlag;
