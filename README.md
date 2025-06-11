# 1.7. Implement DataLoader for School-Student Relationship

## Description:
Optimize data fetching for the one-to-many relationship between School and Student models by implementing DataLoader. This task focuses on preventing the N+1 query problem by ensuring efficient data retrieval for related entities in both directions: when resolving students for a given school, and when resolving the associated school for a given student.

## Acceptance Criteria:
DataLoader is correctly implemented and integrated into the resolvers for both School to Student and Student to School relationships, leading to optimized database queries.