import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Nat "mo:base/Nat";

actor DVote {
    // User type holding the username and password
    type User = {
        username: Text;
        password: Text;
    }

    // HashMaps for users and votes
    let users = HashMap.HashMap<Text, User>(1, Text.equal, Text.hash);
    let hasVoted = HashMap.HashMap<Text, Bool>(1, Text.equal, Text.hash);

    // Vote counts for the two parties
    var votesPartyA: Nat = 0;
    var votesPartyB: Nat = 0;

    // Function to register a new user
    public func registerUser(username: Text, password: Text) : async Bool {
        if (null == users.get(username)) {
            users.put(username, {username = username; password = password});
            true
        } else {
            false
        }
    }

    // Function to login a user
    public func loginUser(username: Text, password: Text) : async Bool {
    switch (users.get(username)) {
        case (null) { return false; };
        case (?user) { return user.password == password; };
        };
    }


    // Function to cast a vote
    public func castVote(username: Text, party: Text) : async Bool {
        switch (hasVoted.get(username)) {
            case (null) {
                // User hasn't voted yet, so let them vote
                hasVoted.put(username, true);
                if (party == "Party A") {
                    votesPartyA += 1;
                } else if (party == "Party B") {
                    votesPartyB += 1;
                } else {
                    // Invalid party chosen
                    return false;
                };
                true
            };
            case (?_) { 
                // User has already voted
                false 
            };
        }
    }

    // Function to get voting results
    public func getResults() : async Text {
        // Compare the vote counts and declare the winner
        if (votesPartyA > votesPartyB) {
            return "Party A wins with " # Nat.toText(votesPartyA) # " votes!";
        } else if (votesPartyB > votesPartyA) {
            return "Party B wins with " # Nat.toText(votesPartyB) # " votes!";
        } else {
            return "It's a tie with each party having " # Nat.toText(votesPartyA) # " votes!";
        };
    }
}
