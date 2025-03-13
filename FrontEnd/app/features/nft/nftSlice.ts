import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchOwnedNFTs, NFTMetadata } from "./fetchOwnedNFTs";
import { mintMultiple } from "./mintMultipleThunk";
import { quoteSend } from "./quoteSendThunk";
import { send } from "./sendThunk";
import { fetchAllTokenStates, NFTStateData } from "./fetchAllTokenStates";
import { getMintInfo, MintInfo } from "./getMintInfo";
import { publicMint } from "./publicMint";
import { requestCrossChainMint, QuoteSendResponse } from "./requestCrossChainMint";
import { whitelistMint } from "./whitelistMint";
import { fetchMintedNFT } from "./fetchMintedNFT";

export interface DirectNFTMetadata {
  tokenId: number;
  name: string;
  description: string;
  image: string;
}

interface NFTState {
  items: NFTMetadata[];    
  loading: boolean;
  error: string | null;
  mintResult?: unknown;     
  sendResult?: unknown;     
  quoteResult?: unknown;   
  lastRefresh: number;
  tokenStates: NFTStateData[];        
  mintInfo?: MintInfo;               
  publicMintResult?: unknown;         
  crossChainMintResult?: QuoteSendResponse;  
  whitelistMintResult?: unknown;   
  mintedNFT?: DirectNFTMetadata;    
}

const initialState: NFTState = {
  items: [],
  tokenStates: [],
  loading: false,
  error: null,
  lastRefresh: Date.now(),
};

const nftSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    clearNFTs: (state) => {
      state.items = [];
      state.error = null;
    },
    clearMintedNFT: (state) => {
      state.mintedNFT = undefined
    },
    refreshNFTs: (state) => {
      state.lastRefresh = Date.now();
    },
  },
  extraReducers: (builder) => {
    // fetchOwnedNFTs
    builder
      .addCase(fetchOwnedNFTs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnedNFTs.fulfilled, (state, action: PayloadAction<NFTMetadata[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOwnedNFTs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

      // fetchMintedNFT
      builder
      .addCase(fetchMintedNFT.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMintedNFT.fulfilled, (state, action: PayloadAction<DirectNFTMetadata>) => {
        state.loading = false;
        state.mintedNFT = action.payload;
      })
      .addCase(fetchMintedNFT.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // mintMultiple
    builder
      .addCase(mintMultiple.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mintMultiple.fulfilled, (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.mintResult = action.payload;
      })
      .addCase(mintMultiple.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // quoteSend
    builder
      .addCase(quoteSend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(quoteSend.fulfilled, (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.quoteResult = action.payload;
      })
      .addCase(quoteSend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // send
    builder
      .addCase(send.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(send.fulfilled, (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.sendResult = action.payload;
      })
      .addCase(send.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchAllTokenStates
    builder
      .addCase(fetchAllTokenStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTokenStates.fulfilled, (state, action: PayloadAction<NFTStateData[]>) => {
        state.loading = false;
        state.tokenStates = action.payload;
      })
      .addCase(fetchAllTokenStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // getMintInfo
    builder
      .addCase(getMintInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMintInfo.fulfilled, (state, action: PayloadAction<MintInfo>) => {
        state.loading = false;
        state.mintInfo = action.payload;
      })
      .addCase(getMintInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // publicMint
    builder
      .addCase(publicMint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publicMint.fulfilled, (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.publicMintResult = action.payload;
      })
      .addCase(publicMint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // requestCrossChainMint
    builder
      .addCase(requestCrossChainMint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestCrossChainMint.fulfilled, (state, action: PayloadAction<QuoteSendResponse>) => {
        state.loading = false;
        state.crossChainMintResult = action.payload;
      })
      .addCase(requestCrossChainMint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // whitelistMint
    builder
      .addCase(whitelistMint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(whitelistMint.fulfilled, (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.whitelistMintResult = action.payload;
      })
      .addCase(whitelistMint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearNFTs, refreshNFTs } = nftSlice.actions;
export default nftSlice.reducer;
