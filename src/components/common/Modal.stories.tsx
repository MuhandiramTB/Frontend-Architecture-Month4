import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accessible modal dialog with focus trap, Escape-to-close, backdrop click, body scroll lock, ' +
          '`aria-labelledby`, `aria-describedby`, and `aria-modal`. Focus is restored to the trigger on close.',
      },
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Hello"
          description="A basic modal with a description."
        >
          <p className="text-sm text-slate-700 dark:text-slate-200">
            Press <kbd>Esc</kbd> or click the backdrop to dismiss.
          </p>
        </Modal>
      </>
    );
  },
};

export const ConfirmDelete: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>Delete user</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Deactivate user?"
          description="Thilan Buddhika will lose access immediately. This is a soft delete."
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="danger"   onClick={() => setOpen(false)}>Yes, deactivate</Button>
            </>
          }
        >
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You can reactivate this user later by editing their profile.
          </p>
        </Modal>
      </>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open form modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Create user"
          description="Add a new team member."
        >
          <div className="space-y-3">
            <Input label="Name"  placeholder="Subhash Perera" />
            <Input label="Email" type="email" placeholder="subhash@bistecglobal.com" />
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Create</Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};
