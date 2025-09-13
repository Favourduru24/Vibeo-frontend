import { apiSlice } from "@/app/api/apiSlice";
import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

const userAdapter = createEntityAdapter({})
 
const initialState = userAdapter.getInitialState()

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUser: builder.query({
            query: () => '/v1/user/get-user',
            validateStatus: (response, result) => {
              return response.status === 200 && !result.isError;
            },
            transformResponse: (responseData) => {
                console.log({responseData})
              const loadedUser = responseData.user.map(user => ({
                ...user,
                id: user._id
              }));
              return userAdapter.setAll(initialState, loadedUser);
            },
            providesTags: (result, error, arg) => {
              if(result?.ids) {
                return [
                  { type: 'User', id: 'List' },
                  ...result.ids.map(id => ({ type: 'User', id }))
                ];
              } else {
                return [{ type: 'User', id: 'List' }];
              }
            }
          }),
          getUserById: builder.query({
  query: () => '/v1/user/get-userId',
  validateStatus: (response, result) => {
    return response.status === 200 && !result.isError;
  },
  transformResponse: (responseData) => {
    // Map the root-level response data (no `.user` nesting)
    return userAdapter.setOne(initialState, {
      ...responseData,  // Spread all fields from the response
      id: responseData._id,  // Explicitly set `id` from `_id`
    });
  },
  providesTags: (result, error, arg) => {
    if (result?.ids) {
      return [
        { type: 'User', id: 'LIST' },
        ...result.ids.map(id => ({ type: 'User', id })),
      ];
    } else {
      return [{ type: 'User', id: 'LIST' }];
    }
  },
}),
          addSubcriber: builder.mutation({
            query: ({user}) => ({
            url: '/v1/user/add-subcriber',
            method: 'PATCH',
             body: { user }
            }),
              invalidatesTags: (result, error, { id }) => [
                { type: 'User', id },
                { type: 'User', id: 'LIST' }
              ]
            }),
          removeSubcriber: builder.mutation({
            query: ({user}) => ({
                url: '/v1/user/remove-subcriber',
                method:'PATCH',
                body: {user}
            }),
            invalidatesTags: (result, error, { id }) => [
              { type: 'User', id },
              { type: 'User', id: 'LIST' }
            ]
          }),
        }),
        overrideExisting: true

})

export const {  
  useGetUserQuery,
  useGetUserByIdQuery,
  useAddSubcriberMutation,
  useRemoveSubcriberMutation
} = userApiSlice

// returns the query result object
export const selectUserResult = userApiSlice.endpoints.getUser.select()

// creates memoized selector
const selectUserData = createSelector(
selectUserResult,
userResult => userResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
selectAll: selectAllUsers,
selectById: selectUserById,
selectIds: selectUserIds
// Pass in a selector that returns the Users slice of state
} = userAdapter.getSelectors(state => selectUserData(state) ?? initialState)

