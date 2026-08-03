import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '@/components';
import type { Review } from '@/types';

interface ReviewListProps {
  reviews?: Review[];
  title?: string;
  showReviewer?: boolean;
}

export function ReviewList({ reviews = [], title, showReviewer = false }: ReviewListProps) {
  return (
    <View style={{ marginTop: 20 }}>
      {title ? <Text style={{ marginBottom: 12, fontWeight: '700', fontSize: 18 }}>{title}</Text> : null}
      {reviews.length === 0 ? (
        <Text style={{ color: '#64748B' }}>No reviews yet.</Text>
      ) : (
        reviews.map((review) => (
          <Card key={review.id} style={{ padding: 12, marginBottom: 12 }}> 
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontWeight: '700', fontSize: 16 }}>{review.rating}/5</Text>
              <Text style={{ color: '#94A3B8', fontSize: 12 }}>{new Date(review.created_at).toLocaleDateString()}</Text>
            </View>
            {review.review_text ? (
              <Text style={{ marginTop: 10, color: '#0F172A', lineHeight: 20 }}>{review.review_text}</Text>
            ) : (
              <Text style={{ marginTop: 10, color: '#64748B', fontStyle: 'italic' }}>No comment provided.</Text>
            )}
            {(showReviewer || review.student?.full_name || review.tutor?.full_name) && (
              <View style={{ marginTop: 10, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 10 }}>
                {review.student?.full_name ? (
                  <Text style={{ color: '#475569' }}>Student: {review.student.full_name}</Text>
                ) : null}
                {review.tutor?.full_name ? (
                  <Text style={{ color: '#475569' }}>Tutor: {review.tutor.full_name}</Text>
                ) : null}
              </View>
            )}
          </Card>
        ))
      )}
    </View>
  );
}
