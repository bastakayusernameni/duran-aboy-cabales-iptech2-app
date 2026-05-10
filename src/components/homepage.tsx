import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingTop: 12,
  } as const,

  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  } as const,

  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  } as const,

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  } as const,

  userInfo: {
    flex: 1,
  } as const,

  username: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  } as const,

  time: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  } as const,

  postImage: {
    width: '100%',
    height: 260,
  } as const,

  captionContainer: {
    padding: 12,
  } as const,

  caption: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  } as const,

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingVertical: 10,
  } as const,

  actionButton: {
    paddingHorizontal: 10,
  } as const,

  actionText: {
    fontSize: 14,
    color: '#6200EE',
    fontWeight: '600',
  } as const,
};

export default function HomePage() {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Post 1 */}
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
            style={styles.avatar}
          />

          <View style={styles.userInfo}>
            <Text style={styles.username}>Maria Clara</Text>
            <Text style={styles.time}>2 hours ago</Text>
          </View>
        </View>

        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
          }}
          style={styles.postImage}
        />

        <View style={styles.captionContainer}>
          <Text style={styles.caption}>
            Beautiful sunset view today 🌅
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>❤️ Like</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>💬 Comment</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>📤 Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Post 2 */}
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100?img=22' }}
            style={styles.avatar}
          />

          <View style={styles.userInfo}>
            <Text style={styles.username}>John Doe</Text>
            <Text style={styles.time}>5 hours ago</Text>
          </View>
        </View>

        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
          }}
          style={styles.postImage}
        />

        <View style={styles.captionContainer}>
          <Text style={styles.caption}>
            Working on my new mobile app 💻🔥
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>❤️ Like</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>💬 Comment</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>📤 Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}