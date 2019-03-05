import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

export const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!) {
    uploadFile(file: $file) {
      name
    }
  }
`;

const FileUpload = () => {
  return (
    <Mutation mutation={UPLOAD_FILE}>
      {uploadFile => (
        <input
          type="file"
          required
          onChange={({
            target: {
              validity,
              files: [file]
            }
          }) => {
            console.log(file);
            return validity.valid && uploadFile({ variables: { file } });
          }}
        />
      )}
    </Mutation>
  );
};

export default FileUpload;
