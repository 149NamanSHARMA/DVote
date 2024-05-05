export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'castVote' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'getResults' : IDL.Func([], [IDL.Text], []),
    'loginUser' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'registerUser' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
