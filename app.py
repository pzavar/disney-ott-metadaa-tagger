
import streamlit as st
import pandas as pd

def main():
    st.title("Disney+ OTT Metadata Tagger")
    st.write("Welcome to the metadata tagging system")
    
    # Add file uploader
    uploaded_file = st.file_uploader("Upload your metadata file", type=['csv'])
    
    if uploaded_file is not None:
        df = pd.read_csv(uploaded_file)
        st.success("File uploaded successfully!")
        st.dataframe(df)

if __name__ == "__main__":
    main()
