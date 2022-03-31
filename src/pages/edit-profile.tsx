import React from "react";
import { gql, useApolloClient } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../components/button";
import { useMe } from "../hooks/useMe";
import {
  EditProfileInput,
  EditProfileMutation,
  useEditProfileMutation,
} from "../graphql/generated/graphql";

export const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();

  const onCompleted = (data: EditProfileMutation) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              verified
              email
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
    }
  };

  const [editProfile, { loading }] = useEditProfileMutation({
    onCompleted,
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<EditProfileInput>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
    },
  });

  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        input: {
          ...(email !== "" && { email }),
          ...(password !== "" && { password }),
        },
      },
    });
  };
  return (
    <>
      <Helmet>
        <title>Edit Profile | Muool</title>
      </Helmet>
      <div className="container mx-auto h-full bg-zinc-50">
        <h4 className="mb-3 text-2xl font-semibold">Edit Profile</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto grid w-full max-w-md gap-3 space-y-4 rounded-md bg-white px-4 py-8 shadow"
        >
          <label>
            <span>Email</span>
            <input
              {...register("email", {
                pattern:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              })}
              className="input"
              type="email"
              placeholder="Email"
            />
          </label>
          <label>
            <span>비밀번호</span>
            <input
              {...register("password")}
              className="input"
              type="password"
              placeholder="Password"
            />
          </label>
          <Button
            loading={loading}
            canClick={isValid}
            actionText="Save Profile"
          />
        </form>
      </div>
    </>
  );
};
