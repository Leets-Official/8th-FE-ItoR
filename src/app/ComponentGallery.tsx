import { useState, type ReactNode } from 'react';
import {
  AddPhotoAlternateIcon,
  ChatIcon,
  ClearIcon,
  CreateIcon,
  DeleteForeverIcon,
  DoneIcon,
  ErrorOutlineIcon,
  FolderOpenIcon,
  MoreVertIcon,
  NavigateBeforeIcon,
  ReorderIcon,
  SettingsIcon,
} from '@/shared/assets/icons';

import { Button } from '@/shared/ui/primitives/button';
import { Toaster } from '@/shared/ui/primitives/sonner';
import { ActionMenu } from '@/shared/ui/ActionMenu';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { GitlogButton } from '@/shared/ui/GitlogButton';
import { IconButton } from '@/shared/ui/IconButton';
import { Pagination } from '@/shared/ui/Pagination';
import { PageHeader } from '@/shared/ui/PageHeader';
import { ProfileAvatar } from '@/shared/ui/ProfileAvatar';
import { ProfileCard } from '@/shared/ui/ProfileCard';
import { Skeleton } from '@/shared/ui/Skeleton';
import { StatusToast, notify } from '@/shared/ui/StatusToast';
import { TextField } from '@/shared/ui/TextField';
import { Heading, Text } from '@/shared/ui/Typography';

const iconPreviews = [
  { name: 'reorder.svg', Icon: ReorderIcon },
  { name: 'create.svg', Icon: CreateIcon },
  { name: 'chat.svg', Icon: ChatIcon },
  { name: 'more_vert.svg', Icon: MoreVertIcon },
  { name: 'add_photo_alternate.svg', Icon: AddPhotoAlternateIcon },
  { name: 'folder_open.svg', Icon: FolderOpenIcon },
  { name: 'delete_forever.svg', Icon: DeleteForeverIcon },
  { name: 'done.svg', Icon: DoneIcon },
  { name: 'error_outline.svg', Icon: ErrorOutlineIcon },
  { name: 'settings.svg', Icon: SettingsIcon },
  { name: 'clear.svg', Icon: ClearIcon },
  { name: 'navigate_before.svg', Icon: NavigateBeforeIcon },
];

function PreviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title}>
      <h2 className="mb-2 text-sm font-semibold text-violet-600">◆ {title}</h2>
      <div className="rounded-sm border border-dashed border-violet-400 bg-gitlog-preview p-4 sm:p-6">
        {children}
      </div>
    </section>
  );
}

export function ComponentGallery() {
  const [dialogKind, setDialogKind] = useState<'withDescription' | 'simple' | null>(null);
  const [page, setPage] = useState(1);
  const demoItems = [
    { id: 'first', label: '메뉴 1', onSelect: () => notify.success('메뉴 1을 선택했습니다.') },
    { id: 'second', label: '메뉴 2', onSelect: () => notify.success('메뉴 2를 선택했습니다.') },
  ];
  const menuTrigger = (
    <IconButton label="메뉴 열기">
      <ReorderIcon aria-hidden="true" />
    </IconButton>
  );

  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-950">
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-8 sm:py-12">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Gitlog 공통 컴포넌트</h1>
          <p className="mt-2 text-sm text-neutral-600">
            제공된 이미지의 구성과 상태를 확인하기 위한 미리보기입니다.
          </p>
        </div>

        <PreviewSection title="페이지 헤더">
          <div className="space-y-4">
            <PageHeader
              menu={<ActionMenu label="메뉴 열기" trigger={menuTrigger} items={demoItems} />}
              actions={
                <GitlogButton
                  appearance="text"
                  icon={<CreateIcon className="size-4" aria-hidden="true" />}
                  onClick={() => notify.success('작성 버튼을 눌렀습니다.')}
                >
                  깃로그 쓰기
                </GitlogButton>
              }
            />
            <PageHeader
              menu={<ActionMenu label="메뉴 열기" trigger={menuTrigger} items={demoItems} />}
              actions={
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="댓글 보기"
                    onClick={() => notify.success('댓글 버튼을 눌렀습니다.')}
                  >
                    <ChatIcon aria-hidden="true" />
                  </Button>
                  <ActionMenu label="게시물 메뉴" items={demoItems} />
                </>
              }
            />
            <PageHeader
              menu={<ActionMenu label="메뉴 열기" trigger={menuTrigger} items={demoItems} />}
              actions={
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 text-xs text-gitlog-danger hover:text-gitlog-danger"
                    onClick={() => setDialogKind('withDescription')}
                  >
                    삭제하기
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 text-xs"
                    onClick={() => notify.success('게시 버튼을 눌렀습니다.')}
                  >
                    게시하기
                  </Button>
                </>
              }
            />
          </div>
        </PreviewSection>

        <div className="grid gap-8 lg:grid-cols-2">
          <PreviewSection title="토스트">
            <div className="flex min-h-36 flex-col items-start gap-4">
              <div aria-hidden="true">
                <StatusToast status="error" message="내용을 입력해주세요." />
              </div>
              <div aria-hidden="true">
                <StatusToast status="success" message="저장되었습니다!" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => notify.error('내용을 입력해주세요.')}
                >
                  오류 토스트 보기
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => notify.success('저장되었습니다!')}
                >
                  성공 토스트 보기
                </Button>
              </div>
            </div>
          </PreviewSection>

          <PreviewSection title="버튼">
            <div className="grid min-h-36 grid-cols-2 content-start justify-items-start gap-3 sm:grid-cols-4 lg:grid-cols-2">
              {(['outline', 'muted', 'solid', 'text'] as const).map((appearance) => (
                <div key={appearance} className="flex flex-col items-start gap-2">
                  <GitlogButton appearance={appearance} icon={<CreateIcon aria-hidden="true" />}>
                    깃로그 시작하기
                  </GitlogButton>
                  <GitlogButton
                    appearance={appearance}
                    icon={<CreateIcon aria-hidden="true" />}
                    disabled
                  >
                    깃로그 시작하기
                  </GitlogButton>
                </div>
              ))}
            </div>
          </PreviewSection>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <PreviewSection title="드롭다운 메뉴">
            <div className="flex min-h-30 flex-wrap items-start gap-5">
              <ActionMenu
                label="기본 드롭다운 메뉴"
                items={demoItems}
                trigger={<GitlogButton appearance="outline">기본 메뉴 열기</GitlogButton>}
              />
              <ActionMenu
                label="플랫 드롭다운 메뉴"
                items={demoItems}
                appearance="flat"
                trigger={<GitlogButton appearance="muted">플랫 메뉴 열기</GitlogButton>}
              />
            </div>
          </PreviewSection>

          <PreviewSection title="모달">
            <div className="flex min-h-30 flex-wrap items-start gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogKind('withDescription')}
              >
                설명 있는 모달 열기
              </Button>
              <Button type="button" variant="outline" onClick={() => setDialogKind('simple')}>
                설명 없는 모달 열기
              </Button>
            </div>
          </PreviewSection>
        </div>

        <PreviewSection title="텍스트">
          <div className="mx-auto max-w-xl space-y-5 py-2">
            <div className="bg-white p-4">
              <Heading level={3} size="display">
                32 Title one line
              </Heading>
              <Text muted className="mt-3">
                subtitle one line
              </Text>
            </div>
            <div className="bg-white p-4">
              <Heading level={3}>16 Title one line</Heading>
              <Text muted lineClamp={2} className="mt-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a type specimen book.
              </Text>
            </div>
            <div className="bg-white p-4">
              <Text muted>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a type specimen book.
              </Text>
            </div>
          </div>
        </PreviewSection>

        <div className="grid gap-8 lg:grid-cols-2">
          <PreviewSection title="프로필 사진">
            <div className="flex min-h-56 flex-col items-center justify-around gap-5 bg-white py-4">
              <ProfileAvatar alt="내 프로필" size="xl" />
              <ProfileAvatar alt="내 프로필" size="lg" />
              <ProfileAvatar alt="내 프로필" size="md" />
              <ProfileAvatar alt="내 프로필" size="sm" />
            </div>
          </PreviewSection>

          <PreviewSection title="아이콘">
            <div className="grid min-h-56 grid-cols-3 gap-5 bg-white p-4 sm:grid-cols-6">
              {iconPreviews.map(({ name, Icon }) => (
                <div key={name} className="flex flex-col items-center gap-2 text-neutral-800">
                  <span className="flex size-10 items-center justify-center rounded border border-dashed border-neutral-200">
                    <Icon aria-hidden="true" className="size-8" />
                  </span>
                  <code className="max-w-full text-center text-[10px] break-all">{name}</code>
                </div>
              ))}
            </div>
          </PreviewSection>
        </div>

        <PreviewSection title="아이콘 버튼 크기와 클릭">
          <div className="flex min-h-36 items-start gap-8 bg-white p-4">
            <IconButton label="작은 메뉴" size="sm">
              <ReorderIcon aria-hidden="true" />
            </IconButton>
            <IconButton label="메뉴">
              <ReorderIcon aria-hidden="true" />
            </IconButton>
            <IconButton label="큰 메뉴" size="lg">
              <ReorderIcon aria-hidden="true" />
            </IconButton>
            <IconButton
              label="메뉴 열기"
              onClick={() => notify.success('메뉴 버튼을 눌렀습니다.')}
              className="rounded-xl bg-neutral-100 hover:bg-neutral-200"
            >
              <ReorderIcon aria-hidden="true" />
            </IconButton>
          </div>
        </PreviewSection>

        <PreviewSection title="페이지네이션">
          <div className="flex flex-col gap-6 bg-gitlog-preview p-2">
            <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
            <div className="flex gap-4">
              <Pagination currentPage={1} totalPages={5} onPageChange={setPage} />
              <Pagination currentPage={3} totalPages={5} onPageChange={setPage} />
            </div>
          </div>
        </PreviewSection>

        <PreviewSection title="텍스트 필드">
          <div className="space-y-8 bg-gitlog-preview p-1">
            <div className="space-y-4">
              <TextField aria-label="기본 텍스트 필드" placeholder="Text field" />
              <TextField aria-label="입력된 텍스트 필드" defaultValue="Text field" />
              <TextField
                aria-label="포커스 텍스트 필드"
                defaultValue="Text field"
                className="border-neutral-500"
              />
              <TextField aria-label="비활성 텍스트 필드" defaultValue="Text field" disabled />
            </div>
            <div className="space-y-8 px-7">
              <TextField id="title" label="제목" placeholder="Text field" />
              <TextField
                id="description"
                label="제목"
                placeholder="Text field"
                hint="* 주의 문구"
              />
            </div>
          </div>
        </PreviewSection>

        <div className="grid gap-8 lg:grid-cols-2">
          <PreviewSection title="프로필 카드">
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileCard
                title="You can make anything by writing"
                avatarAlt="Gitlog 프로필"
                actions={<GitlogButton>깃로그 시작하기</GitlogButton>}
              />
              <ProfileCard
                title="{닉네임}"
                description="닉네임 소개"
                avatarAlt="내 프로필"
                actions={
                  <>
                    <GitlogButton>내 깃로그</GitlogButton>
                    <GitlogButton>깃로그 쓰기</GitlogButton>
                  </>
                }
                footer={
                  <>
                    <GitlogButton appearance="muted" icon={<SettingsIcon aria-hidden="true" />}>
                      설정
                    </GitlogButton>
                    <GitlogButton appearance="muted">로그아웃</GitlogButton>
                  </>
                }
              />
            </div>
          </PreviewSection>

          <PreviewSection title="빈 콘텐츠 스켈레톤">
            <div className="space-y-8 p-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-13 w-full" />
            </div>
          </PreviewSection>
        </div>
      </main>
      <ConfirmDialog
        open={dialogKind !== null}
        onOpenChange={(open) => {
          if (!open) setDialogKind(null);
        }}
        title={'Title line one\nTitle line two'}
        description={
          dialogKind === 'withDescription'
            ? 'description line one\ndescription line two'
            : undefined
        }
        confirmLabel={dialogKind === 'withDescription' ? '삭제하기' : '확인'}
        confirmVariant={dialogKind === 'withDescription' ? 'destructiveSolid' : 'default'}
        onConfirm={() => {
          setDialogKind(null);
          notify.success('확인했습니다.');
        }}
      />
      <Toaster />
    </div>
  );
}
