"use client";

import {
	Avatar,
	Button,
	Card,
	CardCaption,
	Checkbox,
	Chip,
	ContentBadge,
	Divider,
	FlexBox,
	Loading,
	Option,
	ProgressIndicator,
	SearchField,
	SegmentedControl,
	SegmentedControlItem,
	Select,
	Switch,
	Tab,
	TabList,
	TabListItem,
	TabPanel,
	TextArea,
	TextButton,
	TextField,
	Typography,
} from "@wanteddev/wds";
import { type ReactNode, useState } from "react";
import { useToast } from "src/shared/hooks/toast/use-toast";

type SectionProps = {
	title: string;
	description: string;
	children: ReactNode;
};

const PreviewBox = ({ children }: { children: ReactNode }) => (
	<Card
		flexDirection="column"
		gap="20px"
		style={{
			padding: "24px",
			border: "1px solid rgba(15, 23, 42, 0.08)",
			boxShadow: "none",
		}}
	>
		{children}
	</Card>
);

const PreviewSection = ({ title, description, children }: SectionProps) => (
	<FlexBox flexDirection="column" gap="12px">
		<FlexBox flexDirection="column" gap="4px">
			<Typography display="block" variant="title3" weight="bold">
				{title}
			</Typography>
			<CardCaption variant="body2" display="block">
				{description}
			</CardCaption>
		</FlexBox>
		<PreviewBox>{children}</PreviewBox>
	</FlexBox>
);

const createAvatarDataUri = (label: string, background: string, color: string) =>
	`data:image/svg+xml;utf8,${encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
			<rect width="64" height="64" rx="32" fill="${background}" />
			<text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" fill="${color}" font-family="Arial, sans-serif" font-size="24" font-weight="700">${label}</text>
		</svg>`,
	)}`;

const staffAvatarSrc = createAvatarDataUri("SN", "#2563eb", "#ffffff");
const companyAvatarSrc = createAvatarDataUri("WD", "#0f172a", "#f8fafc");

export default function Page() {
	const toast = useToast();
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [marketingEnabled, setMarketingEnabled] = useState(false);
	const [density, setDensity] = useState("comfortable");
	const [workspace, setWorkspace] = useState("design-system");
	const [tab, setTab] = useState("account");

	return (
		<FlexBox
			as="main"
			flexDirection="column"
			gap="32px"
			style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 24px 96px" }}
		>
			<FlexBox flexDirection="column" gap="8px">
				<Typography display="block" variant="title1" weight="bold">
					Component Preview
				</Typography>
				<Typography display="block" variant="body2">
					WDS 컴포넌트를 shadcn 예제 페이지처럼 섹션별로 바로 확인하는 프리뷰 화면입니다.
					실제 화면에서 자주 조합되는 패턴 위주로 배치했습니다.
				</Typography>
			</FlexBox>

			<Divider />

			<PreviewSection
				title="Buttons"
				description="주요 버튼, 보조 버튼, 텍스트 버튼과 즉시 확인 가능한 토스트 액션입니다."
			>
				<FlexBox flexDirection="column" gap="16px">
					<FlexBox gap="12px" flexWrap="wrap">
						<Button>Primary</Button>
						<Button variant="outlined">Outline</Button>
						<Button color="assistive">Assistive</Button>
						<TextButton>Text Button</TextButton>
					</FlexBox>
					<FlexBox gap="12px" flexWrap="wrap">
						<Button size="small" onClick={() => toast.success("성공 토스트 예시입니다.")}>
							Success Toast
						</Button>
						<Button
							size="small"
							variant="outlined"
							onClick={() => toast.warning("주의가 필요한 상태입니다.")}
						>
							Warning Toast
						</Button>
						<Button
							size="small"
							variant="outlined"
							onClick={() => toast.error("요청 처리에 실패했습니다.")}
						>
							Error Toast
						</Button>
					</FlexBox>
				</FlexBox>
			</PreviewSection>

			<Divider />

			<PreviewSection
				title="Status"
					description="아바타, 뱃지, 칩처럼 목록이나 카드 안에서 자주 쓰는 상태 표현입니다."
			>
				<FlexBox flexDirection="column" gap="16px">
					<FlexBox gap="12px" flexWrap="wrap" alignItems="center">
						<Avatar size="medium" src={staffAvatarSrc} alt="Staff avatar" />
						<Avatar
							size="medium"
							variant="company"
							src={companyAvatarSrc}
							alt="Company avatar"
						/>
						<ContentBadge size="small">Open</ContentBadge>
						<ContentBadge size="small" variant="outlined">
							Beta
						</ContentBadge>
						<Chip size="small" active>
							Selected
						</Chip>
						<Chip size="small" variant="outlined">
							Read Only
						</Chip>
					</FlexBox>
					<FlexBox flexDirection="column" gap="6px">
						<Typography display="block" variant="headline1" weight="bold">
							Workspace Overview
						</Typography>
						<Typography display="block" variant="body2">
							상태 표현용 컴포넌트는 헤더, 리스트, 카드 메타데이터에 바로 적용할 수 있습니다.
						</Typography>
					</FlexBox>
				</FlexBox>
			</PreviewSection>

			<Divider />

			<PreviewSection
				title="Inputs"
				description="텍스트 입력, 검색, 멀티라인 입력을 한 박스에서 확인할 수 있습니다."
			>
				<FlexBox flexDirection="column" gap="16px">
					<FlexBox flexDirection="column" gap="8px">
						<Typography display="block" variant="label1" weight="medium">
							Email
						</Typography>
						<TextField type="email" placeholder="team@wantedlab.com" />
					</FlexBox>
					<FlexBox flexDirection="column" gap="8px">
						<Typography display="block" variant="label1" weight="medium">
							Search
						</Typography>
						<SearchField placeholder="Search components..." />
					</FlexBox>
					<FlexBox flexDirection="column" gap="8px">
						<Typography display="block" variant="label1" weight="medium">
							Message
						</Typography>
						<TextArea
							rows={5}
							placeholder="설정 변경 사유나 운영 메모를 입력하는 예시 영역입니다."
						/>
					</FlexBox>
				</FlexBox>
			</PreviewSection>

			<Divider />

			<PreviewSection
				title="Selection"
				description="토글, 체크박스, 세그먼트, 셀렉트처럼 설정 화면에 자주 나오는 선택 컴포넌트입니다."
			>
				<FlexBox flexDirection="column" gap="20px">
					<FlexBox gap="20px" flexWrap="wrap">
						<FlexBox alignItems="center" gap="12px">
							<Switch
								checked={notificationsEnabled}
								onCheckedChange={setNotificationsEnabled}
								size="medium"
							/>
							<Typography display="block" variant="body2">
								알림 {notificationsEnabled ? "활성" : "비활성"}
							</Typography>
						</FlexBox>
						<FlexBox alignItems="center" gap="12px">
							<Checkbox
								checked={marketingEnabled}
								onCheckedChange={setMarketingEnabled}
								size="small"
							/>
							<Typography display="block" variant="body2">
								마케팅 수신 동의
							</Typography>
						</FlexBox>
					</FlexBox>

					<FlexBox flexDirection="column" gap="8px">
						<Typography display="block" variant="label1" weight="medium">
							Density
						</Typography>
						<SegmentedControl value={density} onValueChange={setDensity} size="small">
							<SegmentedControlItem value="comfortable">Comfortable</SegmentedControlItem>
							<SegmentedControlItem value="compact">Compact</SegmentedControlItem>
							<SegmentedControlItem value="dense">Dense</SegmentedControlItem>
						</SegmentedControl>
					</FlexBox>

					<FlexBox flexDirection="column" gap="8px">
						<Typography display="block" variant="label1" weight="medium">
							Workspace
						</Typography>
						<Select
							value={workspace}
							onChange={setWorkspace}
							placeholder="워크스페이스를 선택하세요"
						>
							<Option value="design-system">Design System</Option>
							<Option value="growth-lab">Growth Lab</Option>
							<Option value="ops-center">Ops Center</Option>
						</Select>
					</FlexBox>
				</FlexBox>
			</PreviewSection>

			<Divider />

			<PreviewSection
				title="Feedback"
				description="로딩과 진행률처럼 처리 상태를 보여주는 피드백 컴포넌트입니다."
			>
				<FlexBox gap="24px" flexWrap="wrap" alignItems="center">
					<FlexBox
						alignItems="center"
						gap="12px"
						style={{
							padding: "12px 16px",
							borderRadius: "12px",
							backgroundColor: "rgba(15, 23, 42, 0.03)",
						}}
					>
						<Loading variant="circular" size={20} />
						<Typography display="block" variant="body2">
							데이터를 불러오는 중입니다.
						</Typography>
					</FlexBox>

					<FlexBox
						flexDirection="column"
						gap="8px"
						style={{
							minWidth: "280px",
							flex: "1 1 320px",
							padding: "12px 16px",
							borderRadius: "12px",
							backgroundColor: "rgba(15, 23, 42, 0.03)",
						}}
					>
						<FlexBox justifyContent="space-between" alignItems="center">
							<Typography display="block" variant="label2">
								배포 진행률
							</Typography>
							<Typography display="block" variant="caption1">
								72%
							</Typography>
						</FlexBox>
						<ProgressIndicator percent={72} style={{ width: "100%" }} />
					</FlexBox>
				</FlexBox>
			</PreviewSection>

			<Divider />

			<PreviewSection
				title="Tabs"
				description="계정/팀/권한처럼 문서형 설정 페이지에서 자주 쓰는 탭 패턴입니다."
			>
				<Tab value={tab} onValueChange={setTab}>
					<FlexBox flexDirection="column" gap="16px">
						<TabList size="small">
							<TabListItem value="account">Account</TabListItem>
							<TabListItem value="team">Team</TabListItem>
							<TabListItem value="permissions">Permissions</TabListItem>
						</TabList>

						<TabPanel value="account">
							<FlexBox flexDirection="column" gap="8px">
								<Typography display="block" variant="body1" weight="medium">
									Account Settings
								</Typography>
								<Typography display="block" variant="body2">
									개인 프로필과 로그인 관련 설정이 배치되는 기본 탭 예시입니다.
								</Typography>
							</FlexBox>
						</TabPanel>

						<TabPanel value="team">
							<FlexBox flexDirection="column" gap="8px">
								<Typography display="block" variant="body1" weight="medium">
									Team Settings
								</Typography>
								<Typography display="block" variant="body2">
									워크스페이스 멤버와 공통 운영 정책을 관리하는 탭 예시입니다.
								</Typography>
							</FlexBox>
						</TabPanel>

						<TabPanel value="permissions">
							<FlexBox flexDirection="column" gap="8px">
								<Typography display="block" variant="body1" weight="medium">
									Permission Settings
								</Typography>
								<Typography display="block" variant="body2">
									역할별 접근 권한과 승인 정책을 노출하는 탭 예시입니다.
								</Typography>
							</FlexBox>
						</TabPanel>
					</FlexBox>
				</Tab>
			</PreviewSection>
		</FlexBox>
	);
}
