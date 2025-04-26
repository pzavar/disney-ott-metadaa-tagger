
import streamlit as st
import pandas as pd

def main():
    try:
        st.title("Disney+ OTT Metadata Tagger")
        st.write("Welcome to the metadata tagging system")
        
        uploaded_file = st.file_uploader("Upload your metadata file", type=['csv'])
        
        if uploaded_file is not None:
            df = pd.read_csv(uploaded_file)
            st.success("File uploaded successfully!")
            st.dataframe(df)
    except Exception as e:
        st.error(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()
