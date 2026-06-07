import {
  Cards02Icon,
  Clock01Icon,
  Notification03Icon,
  PencilEdit02Icon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar } from "@/components/avatar";
import { BottomNav } from "@/components/bottom-nav";
import { EditProfileSheet } from "@/components/edit-profile-sheet";
import { MusicSoundSheet } from "@/components/music-sound-sheet";
import { SettingsRow } from "@/components/settings-row";
import { StatBadge } from "@/components/stat-badge";
import { ToggleSwitch } from "@/components/toggle-switch";
import { Tokens } from "@/constants/tokens";
import { useProfileStore } from "@/contexts/profile-store";

export default function ProfileScreen() {
  const router = useRouter();
  const {
    name,
    avatarId,
    colorKey,
    notifications,
    audio,
    stats,
    updateProfile,
    setNotifications,
    setAudio,
  } = useProfileStore();

  const [editOpen, setEditOpen] = useState(false);
  const [audioOpen, setAudioOpen] = useState(false);

  const displayName = name.trim() || "Friend";
  const avatarBg = Tokens.colors[colorKey][500];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Text style={styles.title}>
          {"Your "}
          <Text style={styles.titleAccent}>Profile</Text>
        </Text>

        {/* ── Identity ── */}
        <View style={styles.identity}>
          <View
            style={[
              styles.avatarCircle,
              {
                backgroundColor: avatarBg,
                borderColor: Tokens.colors[colorKey][600],
              },
            ]}
          >
            <Avatar id={avatarId} size={130} />
          </View>
          <Text style={styles.username}>{displayName}</Text>
          <TouchableOpacity
            style={styles.editLink}
            activeOpacity={0.7}
            onPress={() => setEditOpen(true)}
          >
            <HugeiconsIcon
              icon={PencilEdit02Icon}
              size={18}
              color={Tokens.colors.neutral[400]}
            />
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ── Stats ── */}
        <View style={styles.statsRow}>
          <StatBadge
            value={stats.played}
            label="Cards Played"
            colorKey="teal"
          />
          <View style={styles.statDivider} />
          <StatBadge
            value={stats.answered}
            label="Cards Answered"
            colorKey="orange"
          />
          <View style={styles.statDivider} />
          <StatBadge value={stats.passed} label="Cards Passed" colorKey="red" />
        </View>

        {/* ── Navigation card ── */}
        <View style={styles.card}>
          <SettingsRow
            icon={Clock01Icon}
            label="Play History"
            onPress={() => router.push("/play-history")}
          />
          <View style={styles.rowDivider} />
          <SettingsRow
            icon={Cards02Icon}
            label="Decks and Cards"
            onPress={() => router.push("/decks-cards")}
          />
        </View>

        {/* ── Settings card ── */}
        <View style={styles.card}>
          <SettingsRow
            icon={Notification03Icon}
            label="Notifications"
            right={
              <ToggleSwitch
                value={notifications}
                onValueChange={setNotifications}
              />
            }
          />
          <View style={styles.rowDivider} />
          <SettingsRow
            icon={VolumeHighIcon}
            label="Music & Sound"
            onPress={() => setAudioOpen(true)}
          />
        </View>
      </ScrollView>

      <BottomNav
        active="profile"
        onSelect={(tab) => {
          if (tab === "deck") router.push("/decks");
          if (tab === "play") router.push("/play");
        }}
      />

      <EditProfileSheet
        visible={editOpen}
        onClose={() => setEditOpen(false)}
        name={displayName}
        avatarId={avatarId}
        colorKey={colorKey}
        onSave={(input) => {
          updateProfile(input);
          setEditOpen(false);
        }}
      />

      <MusicSoundSheet
        visible={audioOpen}
        onClose={() => setAudioOpen(false)}
        audio={audio}
        onSave={(next) => {
          setAudio(next);
          setAudioOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Tokens.colors.white },
  scroll: {
    paddingHorizontal: Tokens.spacing[6],
    paddingTop: Tokens.spacing[4],
    paddingBottom: Tokens.spacing[10],
  },
  title: {
    fontSize: Tokens.typography.fontSize["3xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.neutral[900],
  },
  titleAccent: { color: Tokens.colors.teal[500] },

  // ── Identity ──
  identity: {
    alignItems: "center",
    marginTop: Tokens.spacing[6],
    gap: Tokens.spacing[2],
  },
  avatarCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  username: {
    fontSize: Tokens.typography.fontSize["3xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.neutral[900],
    marginTop: Tokens.spacing[2],
  },
  editLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing[2],
  },
  editText: {
    fontSize: Tokens.typography.fontSize.base,
    color: Tokens.colors.neutral[400],
    fontWeight: Tokens.typography.fontWeight.normal,
  },

  // ── Stats ──
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Tokens.spacing[6],
    marginBottom: Tokens.spacing[2],
  },
  statDivider: {
    width: Tokens.effects.borderWidth.default,
    height: 48,
    backgroundColor: Tokens.colors.neutral[200],
  },

  // ── Cards ──
  card: {
    marginTop: Tokens.spacing[6],
    paddingHorizontal: Tokens.spacing[5],
    paddingVertical: Tokens.spacing[2],
    borderRadius: Tokens.layout.borderRadius["2xl"],
    borderWidth: Tokens.effects.borderWidth.default,
    borderColor: Tokens.colors.neutral[200],
  },
  rowDivider: {
    height: Tokens.effects.borderWidth.default,
    backgroundColor: Tokens.colors.neutral[100],
  },
});
