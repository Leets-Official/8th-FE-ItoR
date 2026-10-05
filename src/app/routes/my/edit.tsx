import { createFileRoute } from '@tanstack/react-router';

import { PROFILE_EDIT_FORM_ID } from '@/features/my/edit/model/profileEdit';
import MyEditPage from '@/pages/my/edit/MyEditPage';

export const Route = createFileRoute('/my/edit')({
  component: MyEditPage,
  staticData: {
    headerVariant: 'profileEdit',
    headerFormId: PROFILE_EDIT_FORM_ID,
  },
});
